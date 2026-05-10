https://web-ge3nqauor-basuakashramanni-8145s-projects.vercel.app/resume

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


---

# Code of Conduct

# Agentic Premier League 2026 🚀

### Powered by Antigravity

Welcome to the official Agentic Premier League 2026 Hackathon.

The Agentic Premier League is committed to building a collaborative, inclusive, innovative, and respectful environment for all participants across the GitHub Organization and team repositories.

This Code of Conduct applies to:

* Participants
* Team Leads
* Mentors
* Organizers
* Judges
* Volunteers
* Sponsors
* Community Members

By participating in this hackathon and contributing to any repository under the organization, you agree to follow these guidelines.

---

# Our Mission

We aim to:

* Encourage innovation and experimentation
* Promote open-source collaboration
* Build impactful and responsible AI systems
* Create a positive developer community
* Help participants learn real-world engineering workflows
* Foster teamwork, creativity, and ethical development

---

# Expected Behavior

All participants are expected to:

✅ Be respectful and professional
✅ Collaborate positively with teammates and mentors
✅ Encourage learning and knowledge sharing
✅ Provide constructive feedback
✅ Respect diverse opinions and backgrounds
✅ Follow repository contribution workflows
✅ Maintain professionalism during demos, discussions, and reviews
✅ Build responsibly using ethical AI practices
✅ Keep repositories clean, organized, and properly documented

---

# Repository & GitHub Standards

Each team repository must maintain:

* A proper `README.md`
* Setup and installation instructions
* Project architecture overview
* Team member details
* Screenshots or demo assets
* Clean and meaningful commit history

---

# Branching & Contribution Rules

Teams are expected to follow proper GitHub workflows.

## Recommended Workflow

```bash
main
  ↓
feature branch
  ↓
pull request
  ↓
review
  ↓
merge
```

---

## Branch Naming Convention

Use descriptive branch names:

```bash
feature-auth-system
feature-ai-agent
fix-dashboard-ui
docs-project-readme
```

---

## Commit Naming Convention

Use meaningful commit messages:

```bash
feat: added AI career assistant
fix: resolved authentication bug
ui: improved dashboard responsiveness
docs: updated setup guide
ai: integrated Gemini API
refactor: optimized API structure
```

---

# Pull Request Guidelines

Before creating a Pull Request:

✅ Ensure the project runs correctly
✅ Update documentation if required
✅ Remove unnecessary files and logs
✅ Verify no secrets/API keys are committed
✅ Ensure commit history is clean and meaningful

---

# Security & API Key Policy

Participants must NEVER commit:

❌ `.env` files
❌ API keys
❌ Database credentials
❌ Access tokens
❌ Private certificates

Instead:

✅ Use `.env.example` files
✅ Store secrets securely
✅ Rotate exposed keys immediately if leaked

---

# Unacceptable Behavior

The following behaviors will NOT be tolerated:

❌ Harassment or discrimination
❌ Hate speech or offensive content
❌ Bullying or personal attacks
❌ Plagiarism without attribution
❌ Spamming repositories or discussions
❌ Uploading malicious or harmful code
❌ Intentionally sabotaging another team’s work
❌ Unauthorized access attempts
❌ Creating unethical or unsafe AI systems
❌ Sharing illegal, harmful, or abusive content

---

# AI & Open Source Ethics

Participants must ensure:

* Responsible use of AI tools and APIs
* Proper attribution for open-source libraries and assets
* Respect for intellectual property
* No misuse of private or sensitive data
* Compliance with API/platform terms of service
* Transparent AI workflows where applicable

---

# Collaboration Rules

Teams may:

✅ Learn from tutorials, frameworks, and public resources
✅ Use open-source tools with attribution
✅ Discuss ideas with mentors and other participants

Teams may NOT:

❌ Copy full projects without meaningful contribution
❌ Re-upload another team’s work
❌ Misrepresent AI-generated work as fully original

---

# Repository Hygiene

To maintain clean repositories:

❌ Do not upload `node_modules/`
❌ Do not upload large datasets or unnecessary binaries
❌ Do not commit build folders unless required
❌ Do not spam commits with meaningless messages

Recommended:

✅ Use `.gitignore` properly
✅ Keep repositories lightweight and organized
✅ Upload large videos/assets externally if needed

---

# Fair Play Policy

The spirit of this hackathon is:

* Learning
* Innovation
* Collaboration
* Community Building

Winning matters, but responsible development, teamwork, and creativity matter more.

---

# Reporting Issues

If you experience or witness behavior violating this Code of Conduct, contact the organizers immediately.

Organizers reserve the right to:

* Issue warnings
* Remove content
* Restrict repository access
* Disqualify teams
* Remove participants from the event if necessary

---

# Final Note

Build products that solve meaningful problems.
Support your teammates.
Respect the community.
Create responsibly.

Let’s build the future of Agentic AI together 🚀

---

### Organized with ❤️ by GDG Nagpur
