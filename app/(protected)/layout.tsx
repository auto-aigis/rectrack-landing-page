'use client';

export const dynamic = 'force-dynamic';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/app/_components/AuthProvider';
import { AppShell } from '@/app/_components/AppShell';

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !user.onboarding_complete) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !user.onboarding_complete) return null;

  return <AppShell>{children}</AppShell>;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}