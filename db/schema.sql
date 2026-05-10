-- Career Copilot MVP schema (Postgres)

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  target_role text,
  year_of_study text,
  created_at timestamptz not null default now()
);

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  file_url text,
  parsed_json jsonb,
  ats_score int,
  skills text[],
  created_at timestamptz not null default now()
);

create table if not exists skill_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  skill text not null,
  proficiency int,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  location text,
  description text,
  required_skills text[],
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  score numeric,
  ai_reasoning text,
  saved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, job_id)
);

create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text,
  transcript jsonb,
  per_question_scores jsonb,
  overall_score int,
  created_at timestamptz not null default now()
);

create table if not exists growth_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  week_start date not null,
  skills_added text[],
  projects text[],
  reflection text,
  created_at timestamptz not null default now()
);

create table if not exists voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text,
  question text,
  audio_url text,
  whisper_transcript text,
  metrics jsonb,
  feedback jsonb,
  created_at timestamptz not null default now()
);

-- Default web UI user (FK target) until Clerk user IDs are wired through.
insert into users (id, email, name)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000000000000000000000000000@anon.local',
  'Student'
)
on conflict (id) do nothing;
