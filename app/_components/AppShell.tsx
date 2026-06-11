'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthProvider';

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, subscription, logout } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/log', label: 'Log Game', icon: PlusCircle },
    { href: '/history', label: 'History', icon: History },
    { href: '/upgrade', label: 'Upgrade', icon: Crown },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const tierLabel = subscription?.tier === 'plus'
    ? 'RecTrack Plus'
    : subscription?.tier === 'pro'
    ? 'RecTrack Pro'
    : 'RecTrack Free';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2">
          <Menu className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center font-semibold text-gray-900">{tierLabel}</span>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 md:h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">{tierLabel}</span>
          <button className="md:hidden p-2" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-3.5rem)] justify-between">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="md:ml-64 pt-14 md:pt-0">{children}</main>
    </div>
  );
}