import type {
  User,
  Subscription,
  Game,
  CreateGameRequest,
  CoachingTip,
  WeeklySummary,
  SeasonSummary,
  Achievement,
  HistoryResponse,
  CheckoutResponse,
  VerifyTransactionResponse,
  PortalUrlResponse,
  UpgradeResponse,
  OnboardingRequest,
  ProfileUpdateRequest,
  AuthResponse,
  LogoutResponse,
  RegisterResponse,
  VerifyEmailResponse,
  ResendVerificationResponse,
  CsvExportResponse,
  PregameTipResponse,
  AchievementsResponse,
} from './types';

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

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  verifyEmail: (token: string) =>
    apiFetch<VerifyEmailResponse>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<ResendVerificationResponse>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  login: (email: string, password: string) =>
    apiFetch<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<LogoutResponse>('/api/auth/logout', { method: 'POST' }),

  me: () => apiFetch<User>('/api/auth/me'),

  subscription: () => apiFetch<Subscription>('/api/auth/subscription'),
};

export const profileApi = {
  update: (data: ProfileUpdateRequest) =>
    apiFetch<User>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  completeOnboarding: (data: OnboardingRequest) =>
    apiFetch<AuthResponse>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const gamesApi = {
  create: (game: CreateGameRequest) =>
    apiFetch<Game>('/api/games', {
      method: 'POST',
      body: JSON.stringify(game),
    }),

  list: (limit?: number) =>
    apiFetch<Game[]>('/api/games' + (limit ? `?limit=${limit}` : '')),

  get: (gameId: string) =>
    apiFetch<Game>(`/api/games/${gameId}`),

  getHistory: (offset?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (offset) params.set('offset', String(offset));
    if (limit) params.set('limit', String(limit));
    return apiFetch<HistoryResponse>(`/api/history?${params.toString()}`);
  },

  exportCsv: () =>
    apiFetch<CsvExportResponse>('/api/games/export/csv'),
};

export const tipsApi = {
  latest: () => apiFetch<CoachingTip>('/api/tips/latest'),

  pregame: () =>
    apiFetch<PregameTipResponse>('/api/tips/pregame', { method: 'POST' }),

  weeklySummary: () =>
    apiFetch<WeeklySummary>('/api/tips/weekly-summary'),

  seasonSummary: (seasonId?: string) =>
    apiFetch<SeasonSummary>('/api/season-summary', {
      method: 'POST',
      body: JSON.stringify({ season_id: seasonId }),
    }),
};

export const achievementsApi = {
  list: () => apiFetch<AchievementsResponse>('/api/achievements'),
};

export const paddleApi = {
  checkout: (tier: string, billingInterval?: string) =>
    apiFetch<CheckoutResponse>('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  portalUrl: () =>
    apiFetch<PortalUrlResponse>('/api/paddle/portal-url'),

  verifyTransaction: (transactionId: string) =>
    apiFetch<VerifyTransactionResponse>('/api/paddle/verify-transaction', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    }),

  upgrade: () =>
    apiFetch<UpgradeResponse>('/api/paddle/upgrade', { method: 'POST' }),
};