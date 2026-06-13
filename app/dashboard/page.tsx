"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Flame, Target, TrendingUp, Plus, Lock, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { dashboardApi, analyticsApi, paddleApi } from '@/app/_lib/api';
import type { DashboardData, AnalyticsTrends } from '@/app/_lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    dashboardApi.getData().then(setData).catch(() => {}).finally(() => setLoading(false));
    if (user?.tier && user.tier !== 'free') {
      analyticsApi.getTrends().then(setTrends).catch(() => {});
    }
  }, [user?.tier]);

  const handleUpgrade = async (tier: 'pro' | 'elite') => {
    setUpgrading(true);
    try {
      const { checkout_url } = await paddleApi.checkout(tier);
      window.location.href = checkout_url;
    } catch { setUpgrading(false); }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      </AppShell>
    );
  }

  const tier = user?.tier || 'free';
  const isPro = tier === 'pro' || tier === 'elite';
  const isElite = tier === 'elite';

  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hey {user?.display_name?.split(' ')[0] || 'Athlete'} 👋
            </h1>
            <p className="text-gray-500 text-sm">{user?.primary_sport || 'RecTrack'} Performance Dashboard</p>
          </div>
          <Button onClick={() => router.push('/dashboard/log')} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" /> Log Game
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500" />} label="Total Games" value={data?.total_games ?? 0} />
          <StatCard icon={<Target className="w-5 h-5 text-green-500" />} label="Win Rate" value={`${Math.round((data?.win_rate ?? 0) * 100)}%`} />
          <StatCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Win Streak" value={data?.current_streak ?? 0} />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-500" />} label="Tier" value={<Badge className={tier === 'elite' ? 'bg-purple-100 text-purple-700' : tier === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>{tier.toUpperCase()}</Badge>} />
        </div>

        {tier === 'free' && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Free Plan: {5 - (data?.total_games ?? 0)} games remaining this month</p>
                <p className="text-sm text-amber-700">Upgrade to Pro for unlimited games + AI coaching tips</p>
              </div>
              <Button onClick={() => handleUpgrade('pro')} disabled={upgrading} size="sm" className="bg-amber-600 hover:bg-amber-700 shrink-0">
                {upgrading ? 'Loading...' : 'Upgrade to Pro — $12/mo'}
              </Button>
            </CardContent>
          </Card>
        )}

        {data?.pre_game_tip && isPro && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <Zap className="w-4 h-4" /> AI Pre-Game Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-blue-900 text-sm leading-relaxed">{data.pre_game_tip.content}</p>
            </CardContent>
          </Card>
        )}

        <TrendsSection isPro={isPro} trends={trends} onUpgrade={() => handleUpgrade('pro')} upgrading={upgrading} />

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Games</CardTitle>
              <Link href="/dashboard/log" className="text-sm text-green-600 hover:underline">+ Log Game</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {!data?.recent_games?.length ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No games logged yet</p>
                <Button onClick={() => router.push('/dashboard/log')} variant="outline" size="sm">Log Your First Game</Button>
              </div>
            ) : (
              <div className="space-y-2">
                {data.recent_games.map((game) => (
                  <div key={game.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${game.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {game.result}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{game.sport}</p>
                        <p className="text-xs text-gray-500">{new Date(game.logged_at).toLocaleDateString()}{game.opponent_name ? ` · vs ${game.opponent_name}` : ''}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/game/${game.id}`}>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={isPro ? '' : 'opacity-75'}>
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Weekly Insights</p>
                <p className="text-xs text-gray-500">AI-powered weekly summary</p>
              </div>
              {isPro ? (
                <Button onClick={() => router.push('/dashboard/weekly')} size="sm" variant="outline">View</Button>
              ) : (
                <div className="flex items-center gap-1 text-gray-400"><Lock className="w-4 h-4" /><span className="text-xs">Pro</span></div>
              )}
            </CardContent>
          </Card>
          <Card className={isElite ? '' : 'opacity-75'}>
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Elite Analytics</p>
                <p className="text-xs text-gray-500">Percentiles & season comparison</p>
              </div>
              {isElite ? (
                <Button onClick={() => router.push('/dashboard/analytics')} size="sm" variant="outline">View</Button>
              ) : (
                <Button onClick={() => handleUpgrade('elite')} disabled={upgrading} size="sm" variant="outline" className="text-purple-600 border-purple-300">
                  <Lock className="w-3 h-3 mr-1" />Elite
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-gray-500">{label}</span></div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function TrendsSection({ isPro, trends, onUpgrade, upgrading }: { isPro: boolean; trends: AnalyticsTrends | null; onUpgrade: () => void; upgrading: boolean }) {
  if (!isPro) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2"><CardTitle className="text-base">Performance Trends</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className="blur-sm pointer-events-none h-24 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">Unlock trend charts with Pro</p>
              <Button onClick={onUpgrade} disabled={upgrading} size="sm" className="bg-green-600 hover:bg-green-700">
                {upgrading ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!trends || trends.dates.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Performance Trends</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-gray-500">Log more games to see trend charts</p></CardContent>
      </Card>
    );
  }
  const last10 = trends.dates.slice(-10);
  const lastWR = trends.win_rate.slice(-10);
  const lastPPG = trends.points_per_game.slice(-10);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance Trends (Last {last10.length} games)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MiniChart label="Win Rate" data={lastWR} color="bg-green-500" format={(v) => `${Math.round(v * 100)}%`} />
          <MiniChart label="Points/Game" data={lastPPG} color="bg-blue-500" format={(v) => v.toFixed(1)} />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniChart({ label, data, color, format }: { label: string; data: number[]; color: string; format: (v: number) => string }) {
  const max = Math.max(...data, 0.01);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-medium text-gray-700">{data.length > 0 ? format(data[data.length - 1]) : '-'}</span>
      </div>
      <div className="flex items-end gap-0.5 h-12">
        {data.map((v, i) => (
          <div key={i} className={`flex-1 rounded-t ${color} opacity-80`} style={{ height: `${Math.max((v / max) * 100, 4)}%` }} />
        ))}
      </div>
    </div>
  );
}
