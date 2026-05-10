import json
import os
from pathlib import Path

import psycopg


def main() -> None:
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise SystemExit("DATABASE_URL is required (e.g. postgres://user:pass@host:5432/db)")

    seed_path = Path(__file__).with_name("jobs_seed.json")
    jobs = json.loads(seed_path.read_text(encoding="utf-8"))

    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            for j in jobs:
                cur.execute(
                    """
                    insert into jobs (title, company, location, description, required_skills)
                    values (%s, %s, %s, %s, %s)
                    on conflict do nothing
                    """,
                    (
                        j["title"],
                        j.get("company"),
                        j.get("location"),
                        j.get("description"),
                        j.get("required_skills", []),
                    ),
                )
        conn.commit()

    print(f"Seeded {len(jobs)} jobs from {seed_path.name}")


if __name__ == "__main__":
    main()

