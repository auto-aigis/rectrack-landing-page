const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d))
        msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export const authApi = {
  register: (email: string, password: string, display_name: string, timezone: string, sport: string) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name, timezone, sport }),
    }),
  login: (email: string, password: string) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiFetch("/api/auth/logout", { method: "POST" }),
  me: () => apiFetch("/api/auth/me"),
  subscription: () => apiFetch("/api/auth/subscription"),
};

export const gamesApi = {
  create: (played_at: string, sport: string, position: string, stats_json: Record<string, any>, notes: string) =>
    apiFetch("/api/games/", {
      method: "POST",
      body: JSON.stringify({ played_at, sport, position, stats_json, notes }),
    }),
  list: (skip = 0, limit = 20) =>
    apiFetch(`/api/games/?skip=${skip}&limit=${limit}`),
  get: (game_id: string) => apiFetch(`/api/games/${game_id}`),
  update: (game_id: string, played_at?: string, sport?: string, position?: string, stats_json?: Record<string, any>, notes?: string) =>
    apiFetch(`/api/games/${game_id}`, {
      method: "PATCH",
      body: JSON.stringify({ played_at, sport, position, stats_json, notes }),
    }),
};

export const dashboardApi = {
  get: () => apiFetch("/api/dashboard"),
  milestoneSeen: (milestone_weeks: number) =>
    apiFetch("/api/dashboard/milestone-seen", {
      method: "POST",
      body: JSON.stringify({ milestone_weeks }),
    }),
};

export const paymentsApi = {
  verifyTransaction: (transaction_id: string) =>
    apiFetch("/api/payments/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id }),
    }),
};