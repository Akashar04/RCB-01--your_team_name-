from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import User


def ensure_user_exists(db: Session, user_id: uuid.UUID | None) -> None:
    """FK-safe hackathon default: create a row in users if missing (e.g. demo UUID from the web UI)."""
    if user_id is None:
        return
    row = db.execute(select(User.id).where(User.id == user_id)).scalar_one_or_none()
    if row is not None:
        return
    db.add(
        User(
            id=user_id,
            email=f"{user_id.hex}@anon.local",
            name="Student",
        )
    )
    db.flush()
