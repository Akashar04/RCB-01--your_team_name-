"use client";

import { useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";

function formatPct(x: number | null | undefined) {
  if (x == null) return "—";
  return `${Math.round(x * 100)}%`;
}

export default function VoicePage() {
  const [role, setRole] = useState("Software Engineering Intern");
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startAtRef = useRef<number | null>(null);

  async function start() {
    setError(null);
    setResult(null);
    setBlob(null);
    setDuration(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    startAtRef.current = Date.now();
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const b = new Blob(chunksRef.current, { type: "audio/webm" });
      setBlob(b);
      const started = startAtRef.current;
      if (started) setDuration((Date.now() - started) / 1000);
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecording(true);
  }

  function stop() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function analyze() {
    if (!blob) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("user_id", "00000000-0000-0000-0000-000000000000");
      fd.append("role", role);
      fd.append("question", question);
      if (duration != null) fd.append("duration_seconds", String(duration));
      fd.append("audio", new File([blob], "answer.webm", { type: blob.type || "audio/webm" }));
      const data = await apiFetch("/voice/analyze", { method: "POST", body: fd });
      setResult(data as Record<string, unknown>);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed analyzing audio");
    } finally {
      setLoading(false);
    }
  }

  const metrics = result?.metrics as Record<string, unknown> | undefined;
  const feedback = result?.feedback as Record<string, unknown> | undefined;
  const fillerBreakdown = metrics?.filler_breakdown as Record<string, number> | undefined;

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-stack-lg px-margin-x-mobile py-stack-xl md:px-margin-x-desktop">
      <header className="flex flex-col gap-stack-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-on-background">Voice interview coach</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
            <MaterialIcon name="star" filled className="size-[14px] max-h-[14px] max-w-[14px] text-[14px]" />
            Voice AI
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2 lg:col-span-5">
          <h2 className="mb-stack-md text-sm font-semibold uppercase tracking-wide text-on-surface-variant">Session setup</h2>
          <div className="space-y-stack-md">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Role</label>
              <input
                className="mt-base w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Question</label>
              <input
                className="mt-base w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-stack-lg flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low py-stack-xl">
            <div
              className={`mb-stack-md flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full ${recording ? "animate-pulse bg-error/15 text-error" : "bg-secondary/15 text-secondary"}`}
            >
              <MaterialIcon
                name={recording ? "stop_circle" : "mic"}
                filled
                className="size-10 max-h-10 max-w-10 text-[40px]"
              />
            </div>
            <p className="mb-stack-md text-center text-sm text-on-surface-variant">
              {recording ? "Recording… speak naturally." : blob ? "Clip ready — analyze when you’re set." : "Capture a concise answer (30–90s works great)."}
            </p>
            <div className="flex flex-wrap justify-center gap-stack-sm">
              {!recording ? (
                <button
                  type="button"
                  className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-on-secondary shadow-sm hover:bg-[#0d9488]"
                  onClick={start}
                >
                  Start recording
                </button>
              ) : (
                <button type="button" className="rounded-lg bg-error px-6 py-3 text-sm font-medium text-on-error" onClick={stop}>
                  Stop
                </button>
              )}
              <button
                type="button"
                className="rounded-lg border border-outline px-6 py-3 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-50"
                disabled={!blob || loading}
                onClick={analyze}
              >
                {loading ? "Analyzing…" : "Analyze"}
              </button>
            </div>
            {duration != null ? (
              <p className="mt-stack-md text-xs font-semibold text-on-surface-variant">Duration · {duration.toFixed(1)}s</p>
            ) : null}
          </div>

          {error ? <p className="mt-stack-md text-sm text-error">{error}</p> : null}
        </section>

        <section className="flex flex-col gap-stack-md lg:col-span-7">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2">
            <h3 className="mb-stack-sm text-sm font-semibold uppercase tracking-wide text-secondary">Transcript</h3>
            <p className="min-h-24 whitespace-pre-wrap text-base leading-relaxed text-on-surface-variant">
              {typeof result?.transcript === "string" ? result.transcript : "Your transcription lands here after analysis."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-3">
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Words</p>
              <p className="mt-1 text-2xl font-bold text-on-background">{metrics?.total_words != null ? String(metrics.total_words) : "—"}</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Filler rate</p>
              <p className="mt-1 text-2xl font-bold text-secondary">{formatPct(metrics?.filler_rate as number | undefined)}</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">WPM</p>
              <p className="mt-1 text-2xl font-bold text-on-background">
                {metrics?.words_per_minute != null ? Math.round(metrics.words_per_minute as number) : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Filler breakdown</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              {fillerBreakdown && Object.keys(fillerBreakdown).length
                ? Object.entries(fillerBreakdown)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")
                : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-l-4 border-l-secondary border-outline-variant bg-surface-container-lowest p-gutter shadow-ambient-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Overall score</p>
            <p className="mt-1 text-4xl font-bold text-secondary">{feedback?.overall_score != null ? String(feedback.overall_score) : "—"}</p>
            <div className="mt-stack-md grid gap-stack-md sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-on-background">Strengths</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                  {(Array.isArray(feedback?.strengths) ? feedback!.strengths : []).map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-background">Improvements</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                  {(Array.isArray(feedback?.improvements) ? feedback!.improvements : []).map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            {typeof feedback?.ideal_star_answer === "string" ? (
              <div className="mt-stack-md">
                <p className="text-sm font-semibold text-on-background">Upgraded STAR answer</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface-variant">{feedback.ideal_star_answer}</p>
              </div>
            ) : null}
            {typeof feedback?.notes === "string" ? <p className="mt-stack-md text-sm text-on-surface-variant">{feedback.notes}</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
