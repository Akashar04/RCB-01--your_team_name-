import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-stack-md px-margin-x-mobile py-stack-lg md:flex-row md:px-margin-x-desktop">
        <div className="flex flex-col items-center gap-base md:items-start">
          <span className="text-sm font-bold text-on-surface">Career Copilot</span>
          <span className="text-center text-base text-on-surface-variant md:text-left">
            © {new Date().getFullYear()} Career Copilot. Built for the next generation of talent.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-gutter">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Privacy</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Terms</span>
          <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant hover:text-secondary">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
