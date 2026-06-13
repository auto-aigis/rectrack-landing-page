const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} ${error}`);
  }

  return res.json() as Promise<T>;
}

export const authApi = {
  register(email: string, password: string) {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login(email: string, password: string) {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return apiFetch('/api/auth/logout', { method: 'POST' });
  },

  me() {
    return apiFetch('/api/auth/me');
  },

  verifyEmail(token: string) {
    return apiFetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  resendVerification(email: string) {
    return apiFetch('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  subscription() {
    return apiFetch('/api/auth/subscription');
  },
};

export const onboardingApi = {
  sports() {
    return apiFetch<any>('/api/onboarding/sports');
  },

  complete(sport: string, position: string) {
    return apiFetch('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify({ sport, position }),
    });
  },
};

export const gamesApi = {
  list() {
    return apiFetch('/api/games');
  },

  create(data: Record<string, unknown>) {
    return apiFetch('/api/games', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  detail(gameId: string) {
    return apiFetch(`/api/games/${gameId}`);
  },

  insight(gameId: string) {
    return apiFetch(`/api/games/${gameId}/insight`);
  },
};

export const dashboardApi = {
  summary() {
    return apiFetch('/api/dashboard');
  },
};

export const analyticsApi = {
  trends() {
    return apiFetch('/api/analytics/trends');
  },

  percentiles() {
    return apiFetch('/api/analytics/percentiles');
  },

  season() {
    return apiFetch('/api/analytics/season');
  },
};

export const weeklyApi = {
  insights() {
    return apiFetch('/api/weekly-insights');
  },

  generate() {
    return apiFetch('/api/weekly-insights/generate', { method: 'POST' });
  },
};

export const settingsApi = {
  get() {
    return apiFetch('/api/settings');
  },

  update(data: Record<string, unknown>) {
    return apiFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  subscription() {
    return apiFetch('/api/settings/subscription');
  },
};

export const paddleApi = {
  checkout(tier: 'pro' | 'elite') {
    return apiFetch('/api/paddle/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  },

  portal() {
    return apiFetch('/api/paddle/portal');
  },
};
