"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { SideNav } from './SideNav';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !user.onboarding_complete) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:block flex-shrink-0">
        <SideNav />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 z-50">
            <SideNav onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-600">RecTrack</h1>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
