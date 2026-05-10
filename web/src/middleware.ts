import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip _next, static files, and FastAPI proxy (next.config rewrites).
    "/((?!_next|.*\\..*|api-backend/).*)",
  ],
};
