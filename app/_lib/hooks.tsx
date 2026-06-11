'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from './api';
import type { User, Subscription } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscription: Subscription | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [userData, subData] = await Promise.all([
        authApi.me().catch(() => null),
        authApi.subscription().catch(() => null),
      ]);
      setUser(userData);
      setSubscription(subData);
    } catch {
      setUser(null);
      setSubscription(null);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setSubscription(null);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, subscription, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}