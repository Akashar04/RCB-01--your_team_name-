"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";

function isoWeekStart(d: Date) {
  const dd = new Date(d);
  const day = dd.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  dd.setDate(dd.getDate() + diff);
  dd.setHours(0, 0, 0, 0);
  return dd.toISOString().slice(0, 10);
}

export default function GrowthPage() {
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [skillsAdded, setSkillsAdded] = useState("");
  const [projects, setProjects] = useState("");
  const [reflection, setReflection] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const skillsList = useMemo(
    () => skillsAdded.split(",").map((s) => s.trim()).filter(Boolean),
    [skillsAdded],
  );
  const projectsList = useMemo(
    () => projects.split(",").map((s) => s.trim()).filter(Boolean),
    [projects],
  );

  async function onSave() {
    setLoading(true);
    setStatus(null);
    try {
      await apiFetch("/growth/log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: "00000000-0000-0000-0000-000000000000",
          week_start: weekStart,
          skills_added: skillsList,
          projects: projectsList,
          reflection: reflection || null,
        }),
      });
      setStatus("Saved.");
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-container-max flex-1 grid-cols-1 gap-gutter px-margin-x-mobile py-stack-xl md:px-margin-x-desktop lg:grid-cols-12">
      <div className="lg:col-span-7">
        <header className="mb-stack-lg">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary">Momentum</p>
          <h1 className="mt-stack-sm text-4xl font-bold tracking-tight text-on-background md:text-5xl">Growth tracker</h1>
          <p className="mt-base max-w-xl text-lg text-on-surface-variant">
            Lightweight weekly check-ins keep your narrative sharp — skills gained, projects shipped, reflections captured.
          </p>
        </header>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2">
          <div className="mb-stack-lg flex items-center gap-2 border-b border-outline-variant pb-stack-md">
            <MaterialIcon name="edit_calendar" className="text-secondary" />
            <h2 className="text-xl font-semibold text-on-background">Weekly check-in</h2>
          </div>

          <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Week start</label>
              <input
                type="date"
                className="mt-base w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Skills added (comma separated)
              </label>
              <input
                className="mt-base w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={skillsAdded}
                onChange={(e) => setSkillsAdded(e.target.value)}
                placeholder="sql, react, system design"
              />
            </div>
          </div>

          <div className="mt-stack-md">
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Projects</label>
            <input
              className="mt-base w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="portfolio site, club project, internship work"
            />
          </div>

          <div className="mt-stack-md">
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Reflection</label>
            <textarea
              className="mt-base min-h-28 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What improved this week? What’s the next bold move?"
            />
          </div>

          <button
            type="button"
            className="mt-stack-lg rounded-lg bg-secondary px-8 py-3 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488] disabled:opacity-50"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save weekly log"}
          </button>
          {status ? (
            <p className={`mt-stack-md text-sm ${status === "Saved." ? "text-secondary" : "text-error"}`}>{status}</p>
          ) : null}
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="sticky top-28 rounded-xl border border-outline-variant bg-gradient-to-br from-surface-container-lowest to-primary-fixed/30 p-gutter shadow-ambient-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="trending_up" className="text-secondary" />
            <h3 className="text-lg font-semibold text-on-background">Stay consistent</h3>
          </div>
          <p className="mt-stack-md text-sm leading-relaxed text-on-surface-variant">
            Short weekly notes stack up: skills you added, what you shipped, and what you learned. Use them to tighten your story for
            applications and interviews.
          </p>
          <div className="mt-stack-lg rounded-lg border border-outline-variant bg-surface-container-lowest p-stack-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Tip</p>
            <p className="mt-1 text-sm text-on-surface-variant">One honest entry per week beats a blank tracker.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
