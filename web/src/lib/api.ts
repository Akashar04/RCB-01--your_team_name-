import { env } from "@/lib/env";

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${env.apiBaseUrl}${path}`;
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    const hint =
      `Cannot reach the API (via ${env.apiBaseUrl}). ` +
      `Start FastAPI: cd api && .venv\\Scripts\\uvicorn app.main:app --reload --port 8000. ` +
      `If you bypass the proxy and call port 8000 directly, set CORS_ORIGINS in api/.env.`;
    throw new Error(hint);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

