import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmrovbrvPB95y0SQox-XQ8SBMGBHoeubOsIQpODK9btiwEgisWvQPUGXeyYEyC6rARrflGLx0xtkumIwLLMGej_Apq_59fWiJ8zEgqVPtbpTT0mCDc38NehfXEpRhBwP_4-I0M_fuQpyFZMps6IZ1GAdkQoldcH_T2SYw-ia80euJZj75xZ8ORecoPwHG3FltZbYaH43ZRHXwjyeNmR4ylOq6P47MUPCX9VpnDbIHAghM6DkYZO6Zcj4XXCfGqrQnuW02u_0P1izsz";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <section className="relative overflow-hidden px-margin-x-mobile pb-stack-xl pt-stack-xl md:px-margin-x-desktop md:pb-[120px] md:pt-[120px]">
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-surface-container-lowest via-surface to-primary-fixed-dim opacity-40" />
          <div className="relative z-10 mx-auto grid max-w-container-max grid-cols-1 items-center gap-gutter lg:grid-cols-12">
            <div className="flex flex-col gap-stack-lg lg:col-span-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-on-background md:text-5xl md:leading-[56px]">
                From resume to offer — analyze, match, practice, and improve with AI.
              </h1>
              <p className="max-w-[540px] text-lg leading-relaxed text-on-surface-variant">
                We help students turn resumes into outcomes. Career Copilot replaces generic advice with structured,
                personalized signals across ATS fit, internship matching, interviews, and voice coaching.
              </p>
              <div className="mt-base flex flex-col gap-stack-md sm:flex-row">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-secondary px-8 py-4 text-center text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488]"
                >
                  Go to dashboard
                </Link>
                <Link
                  href="/voice"
                  className="rounded-lg border border-secondary px-8 py-4 text-center text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
                >
                  See Voice Coach
                </Link>
              </div>
            </div>
            <div className="relative mt-stack-xl lg:col-span-6 lg:mt-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg">
                {/* Stitch hero asset — external illustration */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="h-full w-full object-cover opacity-90" src={HERO_IMG} />
              </div>
              <div className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-lg bg-primary-fixed-dim opacity-50 mix-blend-multiply blur-xl" />
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant bg-surface py-stack-md px-margin-x-mobile md:px-margin-x-desktop">
          <div className="mx-auto flex max-w-container-max flex-col items-center justify-center gap-stack-md sm:flex-row">
            <MaterialIcon name="verified" className="text-outline" />
            <p className="text-sm font-medium uppercase tracking-wider text-on-surface-variant">
              Resume · Matches · Interviews · Voice coaching
            </p>
          </div>
        </section>

        <section className="bg-background px-margin-x-mobile py-stack-xl md:px-margin-x-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-stack-xl max-w-[600px]">
              <h2 className="mb-stack-sm text-3xl font-semibold tracking-tight text-on-background">
                Intelligent infrastructure for your career.
              </h2>
              <p className="text-base leading-relaxed text-on-surface-variant">
                Four pillars designed to cut guesswork and prepare you for behavioral and technical interviews.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <Link
                href="/resume"
                className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-lg bg-surface-container text-secondary">
                  <MaterialIcon name="document_scanner" />
                </div>
                <h3 className="mb-base text-xl font-semibold text-on-surface">Resume intelligence</h3>
                <p className="flex-grow text-base leading-relaxed text-on-surface-variant">
                  ATS-style scoring, extracted skills, and prioritized fixes from your PDF.
                </p>
              </Link>
              <Link
                href="/internships"
                className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-lg bg-surface-container text-secondary">
                  <MaterialIcon name="work" />
                </div>
                <h3 className="mb-base text-xl font-semibold text-on-surface">Smart internship matching</h3>
                <p className="flex-grow text-base leading-relaxed text-on-surface-variant">
                  Ranked roles from your skill graph plus concise “why it fits” reasoning.
                </p>
              </Link>
              <Link
                href="/interview"
                className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-lg bg-surface-container text-secondary">
                  <MaterialIcon name="record_voice_over" />
                </div>
                <h3 className="mb-base text-xl font-semibold text-on-surface">Mock interviews</h3>
                <p className="flex-grow text-base leading-relaxed text-on-surface-variant">
                  Role-aware questions and STAR-style feedback on your written answers.
                </p>
              </Link>
              <Link
                href="/voice"
                className="relative flex flex-col overflow-hidden rounded-xl border border-outline-variant border-l-4 border-l-secondary bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-stack-md flex items-start justify-between gap-stack-md">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-lg bg-surface-container text-secondary">
                    <MaterialIcon name="graphic_eq" />
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
                    Audio feedback
                  </span>
                </div>
                <h3 className="mb-base text-xl font-semibold text-on-surface">Voice interview coach</h3>
                <p className="flex-grow text-base leading-relaxed text-on-surface-variant">
                  Record answers, get transcripts, filler metrics, pacing, and coaching tailored to your prompt.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
