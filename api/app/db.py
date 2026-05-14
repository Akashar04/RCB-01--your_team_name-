from __future__ import annotations

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def _normalize_db_url(url: str) -> str:
    # SQLAlchemy expects postgresql+psycopg for psycopg3
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    if url.startswith("postgresql://") and "postgresql+psycopg://" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/career_copilot")


def _postgres_ssl_connect_args(url: str) -> dict | None:
    """Use TLS for hosted Postgres (Supabase, Render, Neon, etc.)."""
    if os.getenv("DATABASE_SSL_DISABLE") == "1":
        return None
    u = url.lower()
    if "localhost" in u or "127.0.0.1" in u:
        return None
    if any(
        marker in u
        for marker in (
            "supabase.co",
            "pooler.supabase.com",
            ".render.com",
            "neon.tech",
            "ondigitalocean.com",
        )
    ):
        return {"sslmode": "require"}
    return None


_engine_kwargs: dict = {"pool_pre_ping": True, "future": True}
_ssl = _postgres_ssl_connect_args(DATABASE_URL)
if _ssl:
    _engine_kwargs["connect_args"] = _ssl

engine = create_engine(_normalize_db_url(DATABASE_URL), **_engine_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

