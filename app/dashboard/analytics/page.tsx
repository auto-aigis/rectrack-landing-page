"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Medal, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { analyticsApi, paddleApi } from '@/app/_lib/api';
import type { SeasonStats, PercentileBadge } from '@/app/_lib/types';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [season, setSeason] = useState<SeasonStats | null>(null);
  const [percentiles, setPercentiles] = useState<PercentileBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const isElite = user?.tier === 'elite';

  useEffect(() => {
    if (!isElite) { setLoading(false); return; }
    Promise.all([
      analyticsApi.getSeason().then(setSeason).catch(() => {}),
      analyticsApi.getPercentiles().then((d) => setPercentiles(d.badges)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isElite]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { checkout_url } = await paddleApi.checkout('elite');
      window.location.href = checkout_url;
    } catch { setUpgrading(false); }
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Elite Analytics</h1>
        </div>

        {!isElite ? (
          <Card className="border-purple-200">
            <CardContent className="py-10 text-center space-y-4">
              <Lock className="w-10 h-10 text-purple-400 mx-auto" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">Elite Feature</p>
                <p className="text-sm text-gray-600 mt-1 max-w-xs mx-auto">
                  Unlock season-over-season comparison, percentile rankings vs. all platform users, and multi-sport tracking.
                </p>
              </div>
              <Button onClick={handleUpgrade} disabled={upgrading} className="bg-purple-600 hover:bg-purple-700">
                {upgrading ? 'Loading...' : 'Upgrade to Elite — $24/month'}
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center h-40 items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : (
          <>
            {percentiles.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-500" /> Percentile Rankings
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {percentiles.map((badge) => (
                    <Card key={badge.metric} className="border-yellow-200 bg-yellow-50">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{badge.metric}</p>
                          <p className="text-xs text-gray-600">{badge.label}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-white text-lg px-3 py-1">
                          Top {100 - badge.percentile}%
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {season && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" /> Season Comparison
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <SeasonCard title="This Year" stats={season.this_year} />
                  <SeasonCard title="Last Year" stats={season.last_year} />
                </div>
                {season.this_year.total_games > 0 && season.last_year.total_games > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="py-3">
                      <p className="text-sm font-medium text-blue-900">
                        Win rate change: {' '}
                        <span className={season.this_year.win_rate >= season.last_year.win_rate ? 'text-green-700' : 'text-red-700'}>
                          {season.this_year.win_rate >= season.last_year.win_rate ? '▲' : '▼'}{' '}
                          {Math.abs(Math.round((season.this_year.win_rate - season.last_year.win_rate) * 100))}%
                        </span>
                        {' '}from last year
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!season && percentiles.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Log more games to see your analytics</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function SeasonCard({ title, stats }: { title: string; stats: { total_games: number; wins: number; win_rate: number } }) {
  return (
    <Card>
      <CardHeader className="pb-1"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="pt-0 space-y-1">
        <p className="text-2xl font-bold text-gray-900">{Math.round(stats.win_rate * 100)}%</p>
        <p className="text-xs text-gray-500">{stats.wins}W / {stats.total_games - stats.wins}L</p>
        <p className="text-xs text-gray-400">{stats.total_games} total games</p>
      </CardContent>
    </Card>
  );
}
