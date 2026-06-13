"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { authApi } from '../_lib/api';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, BarChart2, Settings, LogOut, Zap } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/log', label: 'Log Game', icon: PlusCircle },
  { href: '/dashboard/weekly', label: 'Weekly', icon: Zap },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await authApi.logout().catch(() => {});
    setUser(null);
    router.push('/login');
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-gray-900 border-r border-gray-800 flex-col py-6 px-3 z-40">
        <div className="mb-8 px-3">
          <span className="text-emerald-400 font-bold text-xl">RecTrack</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === href ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 px-3">
          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      {/* Desktop content offset */}
      <div className="hidden md:block w-56 shrink-0" />
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40">
        {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${pathname === href ? 'text-emerald-400' : 'text-gray-400'}`}>
            <Icon size={20} />{label}
          </Link>
        ))}
      </nav>
    </>
  );
}
