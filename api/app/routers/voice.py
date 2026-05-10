from __future__ import annotations

import re
import uuid
from collections import Counter

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import VoiceSession
from ..services.ensure_user import ensure_user_exists
from ..services.gemini_client import chat_json, transcribe_audio

router = APIRouter(prefix="/voice", tags=["voice"])


FILLERS = {
    "um",
    "uh",
    "like",
    "you know",
    "actually",
    "basically",
    "literally",
    "so",
    "i mean",
}


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z']+", text.lower())


def _filler_metrics(text: str) -> dict:
    lower = text.lower()
    counts = {}
    for f in FILLERS:
        if " " in f:
            c = len(re.findall(rf"\\b{re.escape(f)}\\b", lower))
        else:
            c = len(re.findall(rf"\\b{re.escape(f)}\\b", lower))
        if c:
            counts[f] = c
    tokens = _tokenize(text)
    total_words = len(tokens)
    filler_total = sum(counts.values())
    return {
        "total_words": total_words,
        "filler_total": filler_total,
        "filler_breakdown": counts,
        "filler_rate": (filler_total / total_words) if total_words else 0.0,
    }


def _estimate_wpm(total_words: int, seconds: float | None) -> float | None:
    if not seconds or seconds <= 0:
        return None
    return (total_words / seconds) * 60.0


@router.post("/analyze")
async def analyze_voice(
    user_id: str = Form(default="00000000-0000-0000-0000-000000000000"),
    role: str = Form(default="Software Engineering Intern"),
    question: str = Form(default="Tell me about yourself."),
    duration_seconds: float | None = Form(default=None),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    uid = uuid.UUID(user_id) if user_id else None
    ensure_user_exists(db, uid)

    raw = await audio.read()

    mime = audio.content_type or "audio/webm"
    transcript = transcribe_audio(raw, mime_type=mime)

    metrics = _filler_metrics(transcript)
    wpm = _estimate_wpm(metrics["total_words"], duration_seconds)
    if wpm is not None:
        metrics["words_per_minute"] = wpm

    system = (
        "You are a voice interview coach. Return strict JSON with keys: "
        "overall_score (0-100 int), strengths (array of 2), improvements (array of 2), "
        "ideal_star_answer (string), notes (string)."
    )
    user = (
        f"Role: {role}\n"
        f"Question: {question}\n"
        f"Transcript:\n{transcript}\n\n"
        f"Speech metrics: {metrics}\n"
        "Give concise coaching and a better STAR answer."
    )
    feedback = chat_json(system=system, user=user)

    vs = VoiceSession(
        user_id=uid,
        role=role,
        question=question,
        audio_url=None,
        whisper_transcript=transcript,
        metrics=metrics,
        feedback=feedback,
    )
    db.add(vs)
    db.commit()
    db.refresh(vs)

    return {
        "voice_session_id": str(vs.id),
        "role": role,
        "question": question,
        "transcript": transcript,
        "metrics": metrics,
        "feedback": feedback,
    }

