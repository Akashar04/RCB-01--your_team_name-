from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Job

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/seed-jobs")
def seed_jobs(db: Session = Depends(get_db)):
    """
    Hackathon helper: seed jobs from db/jobs_seed.json into the jobs table.
    """
    # d:\apl\api\app\routers\admin.py -> d:\apl\db\jobs_seed.json
    seed_path = Path(__file__).resolve().parents[3] / "db" / "jobs_seed.json"
    jobs = json.loads(seed_path.read_text(encoding="utf-8"))

    existing = set(
        (r[0] for r in db.execute(select(Job.title)).all())
    )
    created = 0
    for j in jobs:
        if j["title"] in existing:
            continue
        db.add(
            Job(
                title=j["title"],
                company=j.get("company"),
                location=j.get("location"),
                description=j.get("description"),
                required_skills=j.get("required_skills", []),
            )
        )
        created += 1
    db.commit()
    return {"ok": True, "created": created, "seed_file": str(seed_path)}

