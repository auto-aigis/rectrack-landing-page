const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(', ');
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

import type { User, Subscription, Game, AITip, DashboardData, WeeklyInsight, Sport, AnalyticsTrends, PercentileBadge, SeasonStats } from './types';

export const authApi = {
  register: (email: string, password: string, display_name: string) =>
    apiFetch<{ status: string; email: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    apiFetch<{ status: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<{ status: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch<User>('/api/auth/me'),
  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  getSubscription: () => apiFetch<Subscription>('/api/auth/subscription'),
};

export const onboardingApi = {
  getSports: () => apiFetch<{ sports: Sport[] }>('/api/onboarding/sports'),
  saveSport: (primary_sport: string, position: string) =>
    apiFetch<{ status: string; sport: string; position: string }>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify({ primary_sport, position }),
    }),
};

export const gamesApi = {
  list: (skip: number = 0, limit: number = 10) =>
    apiFetch<{ games: Game[] }>(`/api/games?skip=${skip}&limit=${limit}`),
  create: (sport: string, result: 'W' | 'L', opponent_name: string | null, feeling_notes: string | null, stats: Record<string, number>) =>
    apiFetch<Game>('/api/games', {
      method: 'POST',
      body: JSON.stringify({ sport, result, opponent_name, feeling_notes, stats }),
    }),
  get: (gameId: string) => apiFetch<Game>(`/api/games/${gameId}`),
  getInsight: (gameId: string) => apiFetch<AITip>(`/api/games/${gameId}/insight`),
};

export const dashboardApi = {
  getData: () => apiFetch<DashboardData>('/api/dashboard'),
};

export const analyticsApi = {
  getTrends: () => apiFetch<AnalyticsTrends>('/api/analytics/trends'),
  getPercentiles: () => apiFetch<{ badges: PercentileBadge[] }>('/api/analytics/percentiles'),
  getSeason: () => apiFetch<SeasonStats>('/api/analytics/season'),
};

export const weeklyApi = {
  get: () => apiFetch<WeeklyInsight>('/api/weekly-insights'),
  generate: () => apiFetch<WeeklyInsight>('/api/weekly-insights/generate', { method: 'POST' }),
};

export const settingsApi = {
  get: () => apiFetch<{ primary_sport: string; position: string; api_keys: Record<string, string> }>('/api/settings'),
  update: (primary_sport?: string, position?: string, api_key_openai?: string) =>
    apiFetch<{ status: string }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ primary_sport, position, api_key_openai }),
    }),
  getSubscription: () => apiFetch<Subscription>('/api/settings/subscription'),
};

export const paddleApi = {
  checkout: (tier: 'pro' | 'elite') =>
    apiFetch<{ checkout_url: string }>('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    }),
  portal: () => apiFetch<{ portal_url: string }>('/api/paddle/portal'),
};
