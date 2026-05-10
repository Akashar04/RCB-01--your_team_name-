from __future__ import annotations

import io
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Resume, SkillProfile
from ..services.ensure_user import ensure_user_exists
from ..services.gemini_client import chat_json

router = APIRouter(prefix="/resume", tags=["resume"])


def _pdf_to_text(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    chunks: list[str] = []
    for page in reader.pages:
        chunks.append(page.extract_text() or "")
    return "\n".join(chunks).strip()


@router.post("/analyze")
async def analyze_resume(
    user_id: str = Form(default="00000000-0000-0000-0000-000000000000"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    raw = await file.read()
    try:
        text = _pdf_to_text(raw)
    except PdfReadError as e:
        raise HTTPException(status_code=400, detail=f"Invalid or unreadable PDF: {e}") from e

    uid = uuid.UUID(user_id) if user_id else None
    ensure_user_exists(db, uid)

    system = (
        "You are an ATS resume reviewer for students. "
        "Return strict JSON with keys: ats_score (0-100 integer), skills (array of strings), "
        "top_fixes (array of 3 short strings)."
    )
    user = f"Resume text:\n{text[:12000]}"
    result = chat_json(system=system, user=user)

    skills = [s.strip().lower() for s in (result.get("skills") or []) if isinstance(s, str) and s.strip()]
    ats = result.get("ats_score")
    try:
        ats_int = int(ats) if ats is not None else None
    except Exception:
        ats_int = None

    resume = Resume(
        user_id=uid,
        file_url=None,
        parsed_json=result,
        ats_score=ats_int,
        skills=skills or None,
    )
    db.add(resume)

    if uid and skills:
        for s in skills[:30]:
            db.add(
                SkillProfile(
                    user_id=uid,
                    skill=s,
                    proficiency=None,
                    source="resume",
                )
            )

    db.commit()
    db.refresh(resume)

    return {
        "resume_id": str(resume.id),
        "ats_score": resume.ats_score,
        "skills": resume.skills or [],
        "top_fixes": result.get("top_fixes") or [],
        "raw": result,
    }

