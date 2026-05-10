"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { MaterialIcon } from "@/components/material-icon";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume", label: "Resume" },
  { href: "/internships", label: "Internships" },
  { href: "/interview", label: "Interview" },
  { href: "/voice", label: "Voice Coach" },
  { href: "/growth", label: "Growth" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={
        active
          ? "border-b-2 border-secondary pb-1 text-sm font-bold text-secondary transition-colors duration-200"
          : "text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-secondary"
      }
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface shadow-sm">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-x-mobile md:px-margin-x-desktop">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-on-background">
          <MaterialIcon name="flight_takeoff" filled className="size-8 max-h-8 max-w-8 text-[28px] text-secondary" />
          Career Copilot
        </Link>

        <nav className="hidden h-full items-center gap-gutter md:flex">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoaded ? (
            isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden rounded-lg border border-outline px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-surface-container-low md:block"
                >
                  Sign in
                </button>
              </SignInButton>
            )
          ) : (
            <div className="hidden h-10 w-24 animate-pulse rounded-lg bg-surface-container md:block" aria-hidden />
          )}

          <button
            type="button"
            className="text-on-surface-variant md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MaterialIcon name={mobileOpen ? "close" : "menu"} className="size-8 max-h-8 max-w-8 text-[26px]" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="flex flex-col gap-3 border-t border-outline-variant bg-surface px-margin-x-mobile py-4 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-on-surface"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="mt-2 rounded-lg bg-secondary px-4 py-3 text-center text-sm font-medium text-on-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </button>
            </SignInButton>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
