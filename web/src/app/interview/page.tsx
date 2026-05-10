"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";

export default function InterviewPage() {
  const [role, setRole] = useState("Software Engineering Intern");
  const [questions, setQuestions] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const data = (await apiFetch("/interview/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      })) as { questions?: string[] };
      const qs = data.questions || [];
      setQuestions(qs);
      setQuestion(qs[0] || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed generating questions");
    } finally {
      setLoading(false);
    }
  }

  async function onEvaluate() {
    if (!question || !answer) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const data = (await apiFetch("/interview/evaluate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: "00000000-0000-0000-0000-000000000000",
          role,
          question,
          answer,
        }),
      })) as { feedback?: Record<string, unknown> };
      setFeedback(data.feedback ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed evaluating answer");
    } finally {
      setLoading(false);
    }
  }

  const strengths = Array.isArray(feedback?.strengths) ? (feedback!.strengths as string[]) : [];
  const improvements = Array.isArray(feedback?.improvements) ? (feedback!.improvements as string[]) : [];

  return (
    <main className="mx-auto grid w-full max-w-container-max flex-1 grid-cols-1 items-start gap-gutter px-margin-x-mobile py-stack-xl md:px-margin-x-desktop lg:grid-cols-12">
      <div className="flex flex-col gap-stack-lg lg:col-span-8">
        <header className="flex flex-col gap-base md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-on-background">Mock interview</h1>
            <p className="mt-1 text-base text-on-surface-variant">Behavioral-style prompts plus STAR-shaped coaching.</p>
          </div>
        </header>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient-2">
          <h2 className="mb-stack-md text-xl font-semibold text-on-background">Interview setup</h2>
          <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
            <div className="flex flex-col gap-base">
              <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Target role</label>
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-base text-on-background outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-stack-md rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488] disabled:opacity-50"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate questions"}
          </button>
        </div>

        {questions.length ? (
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient-2">
            <h3 className="mb-stack-md text-sm font-semibold uppercase tracking-wide text-on-surface-variant">Your session</h3>
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Question</label>
            <select
              className="mt-base mb-stack-md w-full appearance-none rounded-lg border border-outline-variant bg-surface py-3 pl-4 pr-10 text-base text-on-background outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            >
              {questions.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Your answer</label>
            <textarea
              className="mt-base min-h-36 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-base text-on-background outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Draft your STAR answer..."
            />

            <button
              type="button"
              className="mt-stack-md rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488] disabled:opacity-50"
              onClick={onEvaluate}
              disabled={loading || !answer}
            >
              {loading ? "Evaluating…" : "Get feedback"}
            </button>

            {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
          </div>
        ) : null}
      </div>

      <aside className="flex flex-col gap-stack-lg lg:col-span-4">
        <div className="sticky top-28 rounded-xl border border-outline-variant border-l-4 border-l-secondary bg-surface-container-lowest p-gutter shadow-ambient-2">
          <div className="mb-stack-md flex items-center gap-2">
            <MaterialIcon name="analytics" className="text-secondary" />
            <h2 className="text-xl font-semibold text-on-background">Evaluation</h2>
          </div>
          {!feedback ? (
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Submit an answer to see strengths, improvements, and an ideal STAR rewrite.
            </p>
          ) : (
            <div className="flex flex-col gap-stack-md">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Score</p>
                <p className="text-4xl font-bold text-secondary">{String(feedback.score ?? "—")}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-on-background">Strengths</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                  {strengths.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-on-background">Improvements</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                  {improvements.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              {typeof feedback.ideal_star_answer === "string" ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-on-background">Ideal STAR sketch</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-on-surface-variant">{feedback.ideal_star_answer}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}
