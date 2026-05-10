"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";

export default function InternshipsPage() {
  const [matches, setMatches] = useState<
    {
      job_id: string;
      title: string;
      company: string;
      location: string;
      score?: number;
      required_skills?: string[];
      why?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSeed() {
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/admin/seed-jobs", { method: "POST" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed seeding jobs");
    } finally {
      setLoading(false);
    }
  }

  async function onGetMatches() {
    setLoading(true);
    setError(null);
    try {
      const data = (await apiFetch("/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: "00000000-0000-0000-0000-000000000000",
          top_k: 8,
        }),
      })) as { matches?: typeof matches };
      setMatches(data.matches || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed getting matches");
    } finally {
      setLoading(false);
    }
  }

  const topSkills = matches[0]?.required_skills?.slice(0, 6) ?? [];

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-stack-lg px-margin-x-mobile py-stack-xl md:px-margin-x-desktop">
      <div className="flex flex-col items-start justify-between gap-stack-md md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-background md:text-5xl">Curated internships</h1>
          <p className="mt-2 max-w-2xl text-lg text-on-surface-variant">
            Ranked by overlap between each role&apos;s required skills and your profile snapshot from the API.
          </p>
        </div>
        <div className="flex w-full flex-col gap-stack-sm sm:flex-row md:w-auto">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-outline px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container md:flex-none"
            onClick={onSeed}
            disabled={loading}
          >
            <MaterialIcon name="add_circle" />
            Seed jobs
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488] md:flex-none disabled:opacity-50"
            onClick={onGetMatches}
            disabled={loading}
          >
            <MaterialIcon name="refresh" className="text-on-secondary" />
            {loading ? "Loading…" : "Refresh matches"}
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="mt-stack-md grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <aside className="hidden space-y-stack-md lg:col-span-4 lg:block">
          <div className="sticky top-28 rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2">
            <h3 className="mb-stack-md flex items-center gap-2 border-b border-outline-variant pb-stack-sm text-xl font-semibold text-on-background">
              <MaterialIcon name="tune" className="text-secondary" />
              Match criteria
            </h3>
            <div className="space-y-stack-md">
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Sample indexed skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {topSkills.length ? (
                    topSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-secondary/20 bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-on-surface-variant">Run matches to preview skill chips.</span>
                  )}
                </div>
              </div>
              <div className="mt-stack-md border-t border-outline-variant pt-stack-sm">
                <p className="flex items-start gap-2 text-xs font-semibold text-on-surface-variant">
                  <MaterialIcon name="info" className="size-4 max-h-4 max-w-4 text-[16px]" />
                  Seed once per fresh database, then refresh matches any time.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-stack-md lg:col-span-8">
          {!matches.length ? (
            <p className="text-base text-on-surface-variant">
              Click <span className="font-semibold text-on-background">Seed jobs</span> once, then{" "}
              <span className="font-semibold text-on-background">Refresh matches</span>.
            </p>
          ) : (
            matches.map((m) => {
              const pct = Math.round((m.score ?? 0) * 100);
              return (
                <article
                  key={m.job_id}
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2 transition-shadow hover:shadow-ambient-3"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-stack-md">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-surface-container">
                        <span className="text-sm font-bold text-secondary">{pct}%</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-on-background">{m.title}</h2>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-base text-on-surface-variant">
                          <MaterialIcon name="domain" className="size-[18px] max-h-[18px] max-w-[18px] text-[18px]" />
                          {m.company} · {m.location}
                        </p>
                        {m.required_skills?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {m.required_skills.map((s) => (
                              <span
                                key={s}
                                className="rounded-full bg-surface-variant px-2 py-1 text-xs font-semibold text-on-surface-variant"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {m.why ? (
                    <div className="mt-stack-md border-l-4 border-secondary bg-surface-container-low p-stack-md">
                      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Why it fits</p>
                      <p className="mt-1 text-base leading-relaxed text-on-surface-variant">{m.why}</p>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
