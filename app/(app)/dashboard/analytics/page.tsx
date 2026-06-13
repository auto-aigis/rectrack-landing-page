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
    try { window.location.href = (await paddleApi.checkout('elite')).checkout_url; }
    catch { setUpgrading(false); }
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-gray-900">Elite Analytics</h1>
        </div>
        {!isElite ? (
          <Card className="border-purple-200">
            <CardContent className="py-10 text-center space-y-4">
              <Lock className="w-10 h-10 text-purple-400 mx-auto" />
              <p className="font-semibold text-gray-900 text-lg">Elite Feature</p>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">Season comparison, percentile rankings, and multi-sport tracking.</p>
              <Button onClick={handleUpgrade} disabled={upgrading} className="bg-purple-600 hover:bg-purple-700">
                {upgrading ? 'Loading...' : 'Upgrade to Elite — $24/month'}
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center h-40 items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>
        ) : (
          <>
            {percentiles.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Medal className="w-5 h-5 text-yellow-500" />Percentile Rankings</h2>
                {percentiles.map((b) => (
                  <Card key={b.metric} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="py-3 flex items-center justify-between">
                      <div><p className="font-medium capitalize">{b.metric}</p><p className="text-xs text-gray-600">{b.label}</p></div>
                      <Badge className="bg-yellow-500 text-white text-lg px-3 py-1">Top {100 - b.percentile}%</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {season && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-500" />Season Comparison</h2>
                <div className="grid grid-cols-2 gap-3">
                  {([['This Year', season.this_year], ['Last Year', season.last_year]] as const).map(([title, s]) => (
                    <Card key={title}>
                      <CardHeader className="pb-1"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-2xl font-bold">{Math.round(s.win_rate * 100)}%</p>
                        <p className="text-xs text-gray-500">{s.wins}W / {s.total_games - s.wins}L · {s.total_games} games</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {!season && percentiles.length === 0 && (
              <Card><CardContent className="py-8 text-center"><p className="text-gray-500">Log more games to see your analytics</p></CardContent></Card>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
