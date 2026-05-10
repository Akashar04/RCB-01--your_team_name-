from __future__ import annotations

import math
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Job, Match, SkillProfile
from ..services.ensure_user import ensure_user_exists
from ..services.gemini_client import chat_json

router = APIRouter(prefix="/match", tags=["match"])


class MatchRequest(BaseModel):
    user_id: str = Field(default="00000000-0000-0000-0000-000000000000")
    top_k: int = Field(default=5, ge=1, le=20)


def _score_overlap(user_skills: set[str], job_skills: list[str] | None) -> float:
    if not job_skills:
        return 0.0
    js = {s.strip().lower() for s in job_skills if s and s.strip()}
    if not js:
        return 0.0
    inter = len(user_skills & js)
    return inter / max(1, len(js))


@router.post("")
def get_matches(payload: MatchRequest, db: Session = Depends(get_db)):
    uid = uuid.UUID(payload.user_id) if payload.user_id else None
    ensure_user_exists(db, uid)

    user_skills: set[str] = set()
    if uid:
        rows = db.execute(select(SkillProfile.skill).where(SkillProfile.user_id == uid)).all()
        user_skills = {r[0].strip().lower() for r in rows if r[0]}

    jobs = db.execute(select(Job)).scalars().all()
    ranked = []
    for j in jobs:
        ranked.append((j, _score_overlap(user_skills, j.required_skills)))
    ranked.sort(key=lambda x: x[1], reverse=True)
    top = ranked[: payload.top_k]

    out = []
    for job, score in top:
        reasoning = None
        if user_skills and score > 0:
            system = "You explain internship matches to students. Return strict JSON with key: why (string)."
            user = (
                f"User skills: {sorted(list(user_skills))}\n"
                f"Job: {job.title} at {job.company}\n"
                f"Required skills: {job.required_skills}\n"
                "Explain briefly why this fits."
            )
            reasoning_json = chat_json(system=system, user=user)
            reasoning = reasoning_json.get("why")

        if uid:
            m = db.execute(
                select(Match).where(Match.user_id == uid, Match.job_id == job.id)
            ).scalar_one_or_none()
            if m is None:
                m = Match(user_id=uid, job_id=job.id, score=float(score), ai_reasoning=reasoning, saved=False)
                db.add(m)
                db.commit()
                db.refresh(m)
            else:
                # Keep saved flag; update score/reasoning opportunistically
                m.score = float(score)
                if reasoning:
                    m.ai_reasoning = reasoning
                db.commit()

        out.append(
            {
                "job_id": str(job.id),
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "required_skills": job.required_skills or [],
                "score": float(score),
                "why": reasoning,
            }
        )

    return {"matches": out, "user_skills": sorted(list(user_skills))}


class SaveRequest(BaseModel):
    user_id: str = Field(default="00000000-0000-0000-0000-000000000000")
    job_id: str
    saved: bool = True


@router.post("/save")
def save_match(payload: SaveRequest, db: Session = Depends(get_db)):
    uid = uuid.UUID(payload.user_id)
    ensure_user_exists(db, uid)
    jid = uuid.UUID(payload.job_id)
    m = db.execute(select(Match).where(Match.user_id == uid, Match.job_id == jid)).scalar_one_or_none()
    if m is None:
        m = Match(user_id=uid, job_id=jid, score=None, ai_reasoning=None, saved=payload.saved)
        db.add(m)
    else:
        m.saved = payload.saved
    db.commit()
    return {"ok": True, "saved": m.saved}

