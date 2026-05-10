import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { MaterialIcon } from "@/components/material-icon";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const name = user?.firstName || user?.username || "there";

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-stack-xl px-margin-x-mobile py-stack-xl md:px-margin-x-desktop">
      <section className="flex flex-col gap-stack-sm">
        <p className="text-sm font-medium uppercase tracking-widest text-secondary">Overview</p>
        <h1 className="text-4xl font-bold tracking-tight text-on-background md:text-5xl">Welcome back, {name}.</h1>
        <p className="mt-base max-w-2xl text-lg text-on-surface-variant">
          Pick up where you left off — analyze your resume, refresh internship matches, run a mock interview, or open the{" "}
          <span className="font-medium text-secondary">voice coach</span>.
        </p>
      </section>

      <section className="flex flex-col gap-stack-md">
        <div className="flex flex-col gap-stack-sm md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-on-background">Continue where you left off</h2>
          <p className="text-sm text-on-surface-variant">
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">Suggested flow</span>
            <span className="ml-2">Resume → Internships → Voice coaching</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          <Link
            href="/resume"
            className="flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-surface-container text-on-surface">
                <MaterialIcon name="description" />
              </div>
              <h3 className="mb-base text-lg font-bold text-on-background">Resume analysis</h3>
              <div className="mb-stack-lg flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-surface-container px-2 py-1 text-xs font-semibold text-on-surface-variant">
                  ATS + skills
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
                  AI analyzed
                </span>
              </div>
            </div>
            <span className="flex items-center justify-center gap-2 rounded-lg border border-outline py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container">
              Open resume <MaterialIcon name="arrow_forward" className="size-[18px] max-h-[18px] max-w-[18px] text-[18px]" />
            </span>
          </Link>

          <Link
            href="/internships"
            className="flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-surface-container text-on-surface">
                <MaterialIcon name="travel_explore" />
              </div>
              <h3 className="mb-base text-lg font-bold text-on-background">Internship matches</h3>
              <div className="mb-stack-lg flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-surface-container px-2 py-1 text-xs font-semibold text-on-surface-variant">
                  Skill overlap
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
                  Ranked list
                </span>
              </div>
            </div>
            <span className="flex items-center justify-center gap-2 rounded-lg border border-outline py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container">
              View matches <MaterialIcon name="arrow_forward" className="size-[18px] max-h-[18px] max-w-[18px] text-[18px]" />
            </span>
          </Link>

          <Link
            href="/voice"
            className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-gutter shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-secondary/10" aria-hidden />
            <div>
              <div className="mb-stack-md flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-secondary text-on-secondary">
                <MaterialIcon name="mic" filled />
              </div>
              <h3 className="mb-base text-lg font-bold text-on-background">Voice interview coach</h3>
              <div className="mb-stack-lg flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-secondary-container px-2 py-1 text-xs font-semibold text-on-secondary-container">
                  Voice AI
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-container px-2 py-1 text-xs font-semibold text-on-surface-variant">
                  Transcript + metrics
                </span>
              </div>
            </div>
            <span className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-sm font-medium text-on-secondary shadow-sm transition-colors hover:bg-[#0d9488]">
              Start coaching <MaterialIcon name="arrow_forward" className="size-[18px] max-h-[18px] max-w-[18px] text-[18px]" />
            </span>
          </Link>
        </div>
      </section>

      <section className="grid gap-gutter sm:grid-cols-2">
        <Link
          href="/interview"
          className="rounded-xl border border-outline-variant bg-surface-container-low p-gutter transition-colors hover:bg-surface-container"
        >
          <div className="text-sm font-semibold text-on-background">Mock interview</div>
          <div className="mt-1 text-sm text-on-surface-variant">Questions + STAR feedback</div>
        </Link>
        <Link
          href="/growth"
          className="rounded-xl border border-outline-variant bg-surface-container-low p-gutter transition-colors hover:bg-surface-container"
        >
          <div className="text-sm font-semibold text-on-background">Growth tracker</div>
          <div className="mt-1 text-sm text-on-surface-variant">Weekly log & streaks</div>
        </Link>
      </section>
    </main>
  );
}
