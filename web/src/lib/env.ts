export const env = {
  // Prefer `/api-backend` so the browser talks only to Next.js; Next proxies to FastAPI (see next.config).
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api-backend",
};

