from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

import google.generativeai as genai
from openai import OpenAI


logger = logging.getLogger(__name__)


def _gemini_api_key() -> str | None:
    key = os.getenv("GEMINI_API_KEY")
    return key.strip() if key else None


def _openai_api_key() -> str | None:
    key = os.getenv("OPENAI_API_KEY")
    return key.strip() if key else None


def gemini_key_present() -> bool:
    return bool(_gemini_api_key())


def openai_key_present() -> bool:
    return bool(_openai_api_key())


def openai_key_looks_valid() -> bool:
    k = _openai_api_key()
    return bool(k and k.startswith("sk-") and len(k) > 20)


def gemini_key_expected_format() -> bool:
    k = _gemini_api_key()
    return bool(k and k.startswith("AIza") and len(k) > 30)


def llm_provider() -> str:
    """Which backend handles chat + voice transcription."""
    if _openai_api_key():
        return "openai"
    if _gemini_api_key():
        return "gemini"
    return "none"


INVALID_GEMINI_NOTE = (
    "GEMINI_API_KEY must be a Google AI Studio key (usually starts with 'AIza'). "
    "Create one at https://aistudio.google.com/apikey."
)


INVALID_OPENAI_NOTE = (
    "OPENAI_API_KEY should start with sk- (from https://platform.openai.com/api-keys)."
)


def default_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def default_openai_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def default_openai_transcribe_model() -> str:
    return os.getenv("OPENAI_TRANSCRIBE_MODEL", "whisper-1")


def default_model() -> str:
    """Backward-compatible default name for logging / Gemini-only callers."""
    return default_gemini_model()


def _openai_client() -> OpenAI:
    base = os.getenv("OPENAI_BASE_URL", "").strip()
    kw: dict[str, str] = {"api_key": _openai_api_key() or ""}
    if base:
        kw["base_url"] = base.rstrip("/")
    return OpenAI(**kw)


def _resolve_openai_chat_model(explicit: str | None) -> str:
    if explicit and explicit.startswith("gpt-"):
        return explicit
    return default_openai_model()


def _audio_suffix(mime_type: str) -> str:
    mt = mime_type.lower().split(";")[0].strip()
    return {
        "audio/webm": ".webm",
        "audio/mp4": ".mp4",
        "audio/mpeg": ".mpeg",
        "audio/mp3": ".mp3",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
        "audio/ogg": ".ogg",
        "audio/flac": ".flac",
        "audio/m4a": ".m4a",
        "audio/x-m4a": ".m4a",
    }.get(mt, ".webm")


def _chat_json_openai(system: str, user: str, model: str | None = None) -> dict[str, Any]:
    if not openai_key_looks_valid():
        logger.warning(INVALID_OPENAI_NOTE)
        return {
            "mode": "invalid_openai_key_format",
            "note": INVALID_OPENAI_NOTE,
            "ats_score": 0,
            "skills": [],
            "top_fixes": [
                "Open https://platform.openai.com/api-keys",
                "Create a secret key → copy (starts with sk-…)",
                "Set OPENAI_API_KEY in api/.env and restart uvicorn",
            ],
        }

    client = _openai_client()
    model_name = _resolve_openai_chat_model(model)
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
        )
    except Exception as e:
        logger.exception("OpenAI chat_json failed")
        return {"mode": "openai_error", "error": str(e)}

    text = (completion.choices[0].message.content or "").strip()
    if not text:
        return {"mode": "openai_empty", "note": "No text returned."}

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        fence = re.search(r"\{[\s\S]*\}", text)
        if fence:
            try:
                return json.loads(fence.group(0))
            except json.JSONDecodeError:
                pass
        return {"mode": "openai_bad_json", "raw": text[:2000]}


def _chat_json_gemini(system: str, user: str, model: str | None = None) -> dict[str, Any]:
    api_key = _gemini_api_key()
    if not api_key:
        return {
            "mode": "no_gemini_key",
            "note": "Set GEMINI_API_KEY in api/.env for AI features.",
        }
    if not gemini_key_expected_format():
        logger.warning(INVALID_GEMINI_NOTE)
        return {
            "mode": "invalid_gemini_key_format",
            "note": INVALID_GEMINI_NOTE,
            "ats_score": 0,
            "skills": [],
            "top_fixes": [
                "Open https://aistudio.google.com/apikey",
                "Create API key → copy (starts with AIza…)",
                "Put in api/.env as GEMINI_API_KEY=… then restart uvicorn",
            ],
        }

    genai.configure(api_key=api_key)
    model_name = model or default_gemini_model()
    if model_name.startswith("gpt-"):
        model_name = default_gemini_model()

    m = genai.GenerativeModel(
        model_name,
        system_instruction=system,
    )
    try:
        response = m.generate_content(
            user,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            ),
        )
    except Exception as e:
        logger.exception("Gemini chat_json failed")
        return {"mode": "gemini_error", "error": str(e)}

    text = (response.text or "").strip()
    if not text:
        return {"mode": "gemini_empty", "note": "No text returned (safety block or quota)."}

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        fence = re.search(r"\{[\s\S]*\}", text)
        if fence:
            try:
                return json.loads(fence.group(0))
            except json.JSONDecodeError:
                pass
        return {"mode": "gemini_bad_json", "raw": text[:2000]}


def chat_json(system: str, user: str, model: str | None = None) -> dict[str, Any]:
    """Structured JSON from OpenAI (preferred) or Gemini."""
    if _openai_api_key():
        return _chat_json_openai(system, user, model)
    return _chat_json_gemini(system, user, model)


def _transcribe_openai(data: bytes, mime_type: str) -> str:
    if not openai_key_looks_valid():
        return f"(Invalid key) {INVALID_OPENAI_NOTE}"

    suffix = _audio_suffix(mime_type)
    filename = f"recording{suffix}"
    client = _openai_client()
    try:
        tr = client.audio.transcriptions.create(
            model=default_openai_transcribe_model(),
            file=(filename, data),
        )
    except Exception as e:
        logger.exception("OpenAI transcribe failed")
        return f"(Transcription error: {e})"

    return (getattr(tr, "text", None) or "").strip()


def _transcribe_gemini(data: bytes, mime_type: str) -> str:
    api_key = _gemini_api_key()
    if not api_key:
        return "(No GEMINI_API_KEY) Dummy transcript: I built a project and learned a lot."
    if not gemini_key_expected_format():
        return f"(Invalid key) {INVALID_GEMINI_NOTE}"

    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_TRANSCRIBE_MODEL", default_gemini_model())
    m = genai.GenerativeModel(model_name)
    prompt = (
        "Transcribe the spoken audio into plain English text only. "
        "No preamble, no quotes—just the words spoken."
    )
    try:
        response = m.generate_content(
            [
                prompt,
                {"mime_type": mime_type, "data": data},
            ]
        )
    except Exception as e:
        logger.exception("Gemini transcribe failed")
        return f"(Transcription error: {e})"

    return (response.text or "").strip()


def transcribe_audio(data: bytes, mime_type: str = "audio/webm") -> str:
    """Speech → text via OpenAI Whisper (preferred) or Gemini multimodal."""
    if _openai_api_key():
        return _transcribe_openai(data, mime_type)
    return _transcribe_gemini(data, mime_type)
