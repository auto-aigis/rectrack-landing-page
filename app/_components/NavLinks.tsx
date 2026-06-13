"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, TrendingUp, Settings, Trophy, Zap } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/log', label: 'Log Game', icon: PlusCircle },
  { href: '/dashboard/weekly', label: 'Weekly Insights', icon: Zap },
  { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/dashboard/elite', label: 'Elite Stats', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 px-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
