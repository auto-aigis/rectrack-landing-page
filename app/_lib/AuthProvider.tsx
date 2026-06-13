"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './api';

interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'elite';
  onboarding_complete: boolean;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await authApi.login(email, password);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    await authApi.register(email, password);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const verifyEmail = async (token: string) => {
    await authApi.verifyEmail(token);
    const userData = await authApi.me();
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
