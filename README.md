# AI Career Copilot (Hackathon)

Monorepo:

- `web/` — Next.js app (Clerk auth + UI)
- `api/` — FastAPI service (resume analysis, matching, interviews, voice coach)
- `db/` — Postgres schema + job seed

---

## Recommended: Supabase (hosted Postgres)

### 1. Create the Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Wait until the project is **Healthy**.
3. Open **Project Settings → Database**.

### 2. Connection string for FastAPI (`api/.env`)

Use the **direct** database URL for a long‑running Python server (not serverless):

1. Under **Connection string**, choose **URI**.
2. Copy the string. It looks like  
   `postgresql://postgres.[REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`  
   **or** the host `db.[PROJECT-REF].supabase.co` on port **5432** (direct).

Paste into `api/.env`:

```bash
# Replace with YOUR URI from Supabase (password is the DB password you set).
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

# Preferred: OpenAI — https://platform.openai.com/api-keys (starts with sk-…)
OPENAI_API_KEY=sk-...
# Optional: OPENAI_MODEL=gpt-4o-mini  OPENAI_TRANSCRIBE_MODEL=whisper-1  OPENAI_BASE_URL=https://api.openai.com/v1

# Only used when OPENAI_API_KEY is unset — Google AI Studio https://aistudio.google.com/apikey (AIzaSy…)
GEMINI_API_KEY=

CORS_ORIGINS=http://localhost:3000
```

Notes:

- If the dashboard URI uses **`postgres://`**, that is fine — the API normalizes it.
- URL‑encode special characters in the password (e.g. `@` → `%40`).
- The database name is usually **`postgres`** on Supabase; you do **not** need a separate `career_copilot` database unless you created one yourself.

### 3. Apply the schema (tables)

Supabase does **not** auto‑run our repo SQL.

1. In Supabase: **SQL Editor → New query**.
2. Paste the full contents of [`db/schema.sql`](db/schema.sql) → **Run**.

You should see no errors; tables like `users`, `jobs`, `resumes`, etc. will appear under **Table Editor**.

### 4. Seed internships (optional)

Either:

- In the app: **Internships → Seed jobs**, or  
- From a terminal (after the API is running):

```bash
curl -X POST http://localhost:8000/admin/seed-jobs
```

---

## Frontend + Clerk (`web/.env.local`)

The UI talks to FastAPI through **Next.js rewrites** (same-origin `/api-backend/*`), so the browser does not need a working direct connection to port **8000** (helps on Windows / firewall setups).

```bash
NEXT_PUBLIC_API_BASE_URL=/api-backend
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Keys: Clerk Dashboard → your application → **API Keys**.

Optional: set `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000` to bypass the proxy and call FastAPI directly (then configure **`CORS_ORIGINS`** in `api/.env`).

---

## Run the stack

### API

```powershell
cd api
.\.venv\Scripts\activate   # after creating venv once + pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --reload-dir app --reload-exclude ".venv"
```

- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- Diagnostics (DB + Gemini key shape): [http://127.0.0.1:8000/health/diagnostics](http://127.0.0.1:8000/health/diagnostics)
- Startup logs should **not** warn about DB if `DATABASE_URL` is correct.

### Web

```powershell
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Optional: local PostgreSQL instead of Supabase

1. Install Postgres locally and create a database (e.g. `career_copilot`).
2. Set `DATABASE_URL` in `api/.env` to match your local user/password.
3. Run `db/schema.sql` with `psql`, or paste it into Supabase‑equivalent tooling.

---

## Full workflow (checklist)

1. **Supabase**: Project created; `DATABASE_URL` in `api/.env`; **SQL Editor** ran `db/schema.sql`.
2. **LLM**: Prefer **`OPENAI_API_KEY`** in `api/.env` ([OpenAI API keys](https://platform.openai.com/api-keys), **`sk-…`**). If unset, the API falls back to **`GEMINI_API_KEY`** from [Google AI Studio](https://aistudio.google.com/apikey) (**`AIzaSy…`**).
3. **Clerk**: `web/.env.local` keys set; restart Next.js if you change them.
4. **CORS**: The API allows `:3000` / `:3001` on `localhost` and `127.0.0.1` by default. If you open Next.js via **Network** URL (e.g. `http://10.x.x.x:3000`), add that origin to `CORS_ORIGINS` in `api/.env` (comma-separated).

### “Failed to fetch” on Resume / Internships

- Run **FastAPI** on port **8000**: `uvicorn app.main:app --reload --port 8000` from `api/`.
- Default setup uses **`NEXT_PUBLIC_API_BASE_URL=/api-backend`** — restart **`npm run dev`** after changing `web/.env.local` or `next.config.ts`.
- Behind the proxy, **`BACKEND_URL`** (default `http://127.0.0.1:8000`) must match where uvicorn listens — Next forwards `/api-backend/*` there.
- Smoke-test backend: **`http://127.0.0.1:8000/health`** and **`http://127.0.0.1:8000/health/diagnostics`** (`llm_provider` is **`openai`** when **`openai_key_looks_valid`** is true, else Gemini when configured).
- Use **`http://localhost:3000`** for dev unless you add your LAN origin to **`CORS_ORIGINS`** (only matters if you bypass the proxy).

## Demo path (about 2 minutes)

1. Resume: upload PDF → ATS + skills + fixes  
2. Internships: **Seed jobs** → **Get matches**  
3. Voice: record → transcript + filler metrics + coaching  
