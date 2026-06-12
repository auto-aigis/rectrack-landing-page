"use client";

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, BarChart3, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/_lib/hooks';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Analytics', href: '/dashboard/weekly', icon: BarChart3 },
  { label: 'Pricing', href: '/pricing', icon: null },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">RecTrack</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-3">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-700" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex md:ml-64 w-full flex-col">
        <div className="md:hidden flex items-center h-14 px-4 border-b border-gray-200 bg-white">
          <button onClick={() => setOpen(!open)} className="p-1.5 text-gray-700">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="flex-1 text-center font-bold text-gray-900">RecTrack</h1>
          <div className="w-8" />
        </div>
        {open && (
          <>
            <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setOpen(false)} />
            <div className="fixed left-0 top-14 z-40 w-64 flex flex-col bg-white border-r border-gray-200 md:hidden max-h-[calc(100vh-3.5rem)]">
              <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        router.push(item.href);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-gray-200 p-3">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-700" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
