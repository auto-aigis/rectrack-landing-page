"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  LogOut,
  Settings,
  TrendingUp,
  Home,
  Plus,
  Award,
  X,
} from 'lucide-react';

interface SideNavProps {
  onClose?: () => void;
}

export function SideNav({ onClose }: SideNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-blue-600">RecTrack</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          href="/dashboard/log"
          onClick={handleNavClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard/log')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Plus size={20} />
          <span className="font-medium">Log Game</span>
        </Link>

        {user?.tier === 'pro' || user?.tier === 'elite' ? (
          <>
            <Link
              href="/dashboard/weekly"
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/weekly')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Weekly Insights</span>
            </Link>

            {user.tier === 'elite' && (
              <Link
                href="/analytics"
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/analytics')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Award size={20} />
                <span className="font-medium">Elite Analytics</span>
              </Link>
            )}
          </>
        ) : null}

        <Link
          href="/settings"
          onClick={handleNavClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {user?.tier} Tier
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
