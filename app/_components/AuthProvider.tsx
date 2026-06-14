"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/app/_lib/api";
import { User, Subscription } from "@/app/_lib/types";

export const AuthContext = createContext<
  | {
      user: User | null;
      subscription: Subscription | null;
      loading: boolean;
      refresh: () => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await authApi.me();
      setUser(data.user);
      setSubscription(data.subscription);
    } catch {
      setUser(null);
      setSubscription(null);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    setSubscription(null);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, subscription, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}