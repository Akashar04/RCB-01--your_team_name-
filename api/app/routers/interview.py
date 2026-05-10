from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Interview
from ..services.ensure_user import ensure_user_exists
from ..services.gemini_client import chat_json

router = APIRouter(prefix="/interview", tags=["interview"])


class StartRequest(BaseModel):
    role: str = Field(default="Software Engineering Intern")


@router.post("/questions")
def generate_questions(payload: StartRequest):
    system = (
        "You generate mock interview questions for students. "
        "Return strict JSON with key questions: array of 5 short questions."
    )
    user = f"Role: {payload.role}"
    out = chat_json(system=system, user=user)
    qs = out.get("questions") or [
        "Tell me about yourself.",
        "Describe a project you're proud of.",
        "Tell me about a challenge you faced and how you solved it.",
        "Why do you want this role?",
        "Explain a concept you learned recently.",
    ]
    return {"role": payload.role, "questions": qs}


class EvaluateRequest(BaseModel):
    user_id: str = Field(default="00000000-0000-0000-0000-000000000000")
    role: str = Field(default="Software Engineering Intern")
    question: str
    answer: str


@router.post("/evaluate")
def evaluate_answer(payload: EvaluateRequest, db: Session = Depends(get_db)):
    uid = uuid.UUID(payload.user_id) if payload.user_id else None
    ensure_user_exists(db, uid)

    system = (
        "You are an interview coach. Return strict JSON with keys: "
        "score (0-100 integer), strengths (array of 2), improvements (array of 2), "
        "ideal_star_answer (string)."
    )
    user = f"Role: {payload.role}\nQuestion: {payload.question}\nAnswer:\n{payload.answer}"
    out = chat_json(system=system, user=user)

    score = out.get("score")
    try:
        score_int = int(score) if score is not None else None
    except Exception:
        score_int = None

    inv = Interview(
        user_id=uid,
        role=payload.role,
        transcript={"question": payload.question, "answer": payload.answer},
        per_question_scores=out,
        overall_score=score_int,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    return {"interview_id": str(inv.id), "feedback": out}

