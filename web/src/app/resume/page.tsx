"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";

const FIX_ICONS = ["error", "warning", "info"] as const;

function StepRow({
  done,
  label,
  active,
}: {
  done: boolean;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <MaterialIcon
        name={done ? "check_circle" : active ? "progress_activity" : "radio_button_unchecked"}
        className={`text-sm ${done ? "text-secondary" : active ? "animate-pulse text-secondary" : "text-outline-variant"} size-[18px] max-h-[18px] max-w-[18px]`}
      />
      <span className={`text-xs font-semibold ${done || active ? "text-on-surface" : "text-on-surface-variant"}`}>{label}</span>
    </div>
  );
}

export default function ResumePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("user_id", "00000000-0000-0000-0000-000000000000");
      const data = await apiFetch("/resume/analyze", { method: "POST", body: fd });
      setResult(data as Record<string, unknown>);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const ats = typeof result?.ats_score === "number" ? result.ats_score : null;
  const skills = Array.isArray(result?.skills) ? (result.skills as string[]) : [];
  const fixes = Array.isArray(result?.top_fixes) ? (result.top_fixes as string[]) : [];
  const dash = ats != null ? `${Math.min(100, Math.max(0, ats))}, 100` : "0, 100";

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-stack-lg px-margin-x-mobile py-stack-xl md:px-margin-x-desktop">
      <header className="flex flex-col items-start justify-between gap-stack-md md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-background md:text-5xl">Resume analysis</h1>
          <p className="mt-stack-sm max-w-2xl text-lg text-on-surface-variant">
            Upload a PDF — we parse text, extract skills, and return ATS-style scoring plus prioritized fixes.
          </p>
        </div>
        <div className="flex items-center gap-stack-md rounded-full border border-surface-dim bg-surface-container-lowest px-4 py-2 shadow-sm">
          <StepRow done={!!result && !loading} label="Parsed" active={loading} />
          <div className="h-[1px] w-4 bg-outline-variant" />
          <StepRow done={!!result && !loading} label="Extracted" active={loading} />
          <div className="h-[1px] w-4 bg-outline-variant" />
          <StepRow done={!!result && !loading} label="Generated" active={loading} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-gutter lg:col-span-4">
          <div className="flex flex-col items-center rounded-xl border border-surface-dim bg-surface-container-lowest p-gutter text-center shadow-ambient-2">
            <h2 className="mb-stack-md w-full text-left text-xl font-semibold text-on-background">ATS fit score</h2>
            <div className="relative mb-stack-sm flex h-48 w-48 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="stroke-[var(--color-surface-container-high)]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                />
                <path
                  className="stroke-[var(--color-secondary)]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={dash}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold tracking-tight text-primary">{ats ?? "—"}</span>
                <span className="text-sm font-medium uppercase tracking-widest text-on-surface-variant">/ 100</span>
              </div>
            </div>
            <p className="text-base text-on-surface-variant">
              {result?.note && typeof result.note === "string"
                ? result.note
                : "Upload a résumé PDF to generate your score and fixes."}
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-gutter text-center shadow-sm transition-colors hover:border-secondary">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="mb-stack-md flex h-12 w-12 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-tertiary-fixed">
              <MaterialIcon name="upload_file" className="text-on-surface-variant" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-on-background">{file ? file.name : "Drop PDF or browse"}</h3>
            <p className="mb-stack-md text-xs font-semibold text-on-surface-variant">PDF only · Max typical upload size</p>
            <button
              type="button"
              className="rounded-lg border border-outline bg-surface px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </button>
          </label>

          <button
            type="button"
            className="rounded-lg bg-secondary py-3 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488] disabled:opacity-50"
            disabled={!file || loading}
            onClick={onAnalyze}
          >
            {loading ? "Analyzing…" : "Analyze resume"}
          </button>
          {error ? <p className="text-sm text-error">{error}</p> : null}
        </div>

        <div className="flex flex-col gap-gutter lg:col-span-8">
          <div className="rounded-xl border border-surface-dim border-l-4 border-l-secondary bg-surface-container-lowest p-gutter shadow-ambient-2">
            <div className="mb-stack-lg flex items-center gap-2">
              <MaterialIcon name="auto_fix_high" className="text-secondary" />
              <h2 className="text-xl font-semibold text-on-background">AI recommended fixes</h2>
            </div>
            <div className="flex flex-col gap-stack-md">
              {!fixes.length ? (
                <p className="text-base text-on-surface-variant">Results appear here after analysis.</p>
              ) : (
                fixes.map((text, i) => (
                  <div
                    key={i}
                    className="group cursor-default rounded-lg border border-surface-dim bg-surface p-stack-md shadow-sm transition-shadow hover:shadow-ambient-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-stack-sm">
                        <MaterialIcon name={FIX_ICONS[i % 3]} className="mt-0.5 text-on-surface-variant" />
                        <p className="text-base leading-relaxed text-on-surface-variant">{text}</p>
                      </div>
                      <MaterialIcon name="expand_more" className="text-outline" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-surface-dim bg-surface-container-lowest p-gutter shadow-ambient-2">
            <h2 className="mb-stack-md text-xl font-semibold text-on-background">Extracted competencies</h2>
            <p className="mb-stack-lg text-base text-on-surface-variant">
              Skills inferred from your document text using extraction plus AI structuring.
            </p>
            <div className="flex flex-wrap gap-2">
              {!skills.length ? (
                <span className="text-sm text-on-surface-variant">—</span>
              ) : (
                skills.map((s, i) => (
                  <span
                    key={s + i}
                    className={
                      i < 3
                        ? "inline-flex items-center gap-1 rounded-full border border-secondary/20 bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container"
                        : "rounded-full bg-surface-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant"
                    }
                  >
                    {i < 3 ? (
                      <>
                        <MaterialIcon name="check" className="text-[14px] size-[14px] max-h-[14px] max-w-[14px]" /> {s}
                      </>
                    ) : (
                      s
                    )}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
