from __future__ import annotations

import uuid
from datetime import date

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import GrowthLog
from ..services.ensure_user import ensure_user_exists

router = APIRouter(prefix="/growth", tags=["growth"])


class GrowthUpsert(BaseModel):
    user_id: str = Field(default="00000000-0000-0000-0000-000000000000")
    week_start: date
    skills_added: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    reflection: str | None = None


@router.post("/log")
def create_log(payload: GrowthUpsert, db: Session = Depends(get_db)):
    uid = uuid.UUID(payload.user_id) if payload.user_id else None
    ensure_user_exists(db, uid)
    row = GrowthLog(
        user_id=uid,
        week_start=payload.week_start,
        skills_added=[s.strip() for s in payload.skills_added if s.strip()] or None,
        projects=[p.strip() for p in payload.projects if p.strip()] or None,
        reflection=payload.reflection,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"growth_id": str(row.id)}


@router.get("/latest")
def latest(user_id: str, db: Session = Depends(get_db)):
    uid = uuid.UUID(user_id) if user_id else None
    row = (
        db.execute(select(GrowthLog).where(GrowthLog.user_id == uid).order_by(desc(GrowthLog.week_start)))
        .scalars()
        .first()
    )
    if not row:
        return {"ok": True, "log": None}
    return {
        "ok": True,
        "log": {
            "id": str(row.id),
            "week_start": row.week_start.isoformat() if row.week_start else None,
            "skills_added": row.skills_added or [],
            "projects": row.projects or [],
            "reflection": row.reflection,
        },
    }

