from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# Load api/.env before any module reads DATABASE_URL (e.g. db.py).
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from .db import engine
from .services.gemini_client import (
    gemini_key_expected_format,
    gemini_key_present,
    llm_provider,
    openai_key_looks_valid,
    openai_key_present,
)
from .models import Base
from .routers.resume import router as resume_router
from .routers.match import router as match_router
from .routers.admin import router as admin_router
from .routers.interview import router as interview_router
from .routers.growth import router as growth_router
from .routers.voice import router as voice_router


def create_app() -> FastAPI:
    app = FastAPI(title="Career Copilot API", version="0.1.0")

    @app.on_event("startup")
    def _startup() -> None:
        try:
            Base.metadata.create_all(bind=engine)
        except OperationalError as e:
            import logging

            logging.warning(
                "DB unavailable at startup (%s). Set DATABASE_URL and ensure Postgres is running.",
                e.orig if hasattr(e, "orig") else e,
            )

    _default_cors = (
        "http://localhost:3000,http://127.0.0.1:3000,"
        "http://localhost:3001,http://127.0.0.1:3001"
    )
    cors_origins = [
        o.strip()
        for o in os.getenv("CORS_ORIGINS", _default_cors).split(",")
        if o.strip()
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict:
        return {"ok": True}

    @app.get("/health/diagnostics")
    def diagnostics() -> dict:
        db_ok = False
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            db_ok = True
        except OperationalError:
            pass
        return {
            "api_running": True,
            "database_ok": db_ok,
            "llm_provider": llm_provider(),
            "openai_key_set": openai_key_present(),
            "openai_key_looks_valid": openai_key_looks_valid(),
            "gemini_key_set": gemini_key_present(),
            "gemini_key_looks_like_ai_studio": gemini_key_expected_format(),
            "hint": (
                "If OPENAI_API_KEY is set, the API uses OpenAI (chat JSON + Whisper). "
                "Otherwise it uses GEMINI_API_KEY (AI Studio). "
                "Try POST /resume/analyze from http://127.0.0.1:8000/docs."
            ),
        }

    app.include_router(resume_router)
    app.include_router(match_router)
    app.include_router(admin_router)
    app.include_router(interview_router)
    app.include_router(growth_router)
    app.include_router(voice_router)

    return app


app = create_app()

