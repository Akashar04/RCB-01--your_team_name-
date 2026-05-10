# Career Copilot API (FastAPI)

## Run locally

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: `http://localhost:8000/health`

AI uses **Google Gemini** (`GEMINI_API_KEY` in `.env`). Optional: `GEMINI_MODEL` (default `gemini-2.0-flash`).

