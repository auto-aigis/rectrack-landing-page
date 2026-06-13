"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { weeklyApi, paddleApi } from '@/app/_lib/api';
import type { WeeklyInsight } from '@/app/_lib/types';

export default function WeeklyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const tier = user?.tier || 'free';
  const isPro = tier === 'pro' || tier === 'elite';

  useEffect(() => {
    if (!isPro) { setLoading(false); return; }
    weeklyApi.get()
      .then(setInsight)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPro]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const data = await weeklyApi.generate();
      setInsight(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { checkout_url } = await paddleApi.checkout('pro');
      window.location.href = checkout_url;
    } catch { setUpgrading(false); }
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Weekly Insights</h1>
        </div>

        {!isPro ? (
          <Card className="border-blue-200">
            <CardContent className="py-8 text-center space-y-4">
              <Lock className="w-10 h-10 text-blue-400 mx-auto" />
              <div>
                <p className="font-semibold text-gray-900">Pro Feature</p>
                <p className="text-sm text-gray-600 mt-1">Get AI-powered weekly performance summaries comparing this week to last week.</p>
              </div>
              <Button onClick={handleUpgrade} disabled={upgrading} className="bg-green-600 hover:bg-green-700">
                {upgrading ? 'Loading...' : 'Upgrade to Pro — $12/month'}
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : (
          <>
            {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}

            {!insight ? (
              <Card>
                <CardContent className="py-8 text-center space-y-4">
                  <p className="text-gray-600">No weekly insight generated yet for this week.</p>
                  <Button onClick={handleGenerate} disabled={generating} className="bg-green-600 hover:bg-green-700 gap-2">
                    <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                    {generating ? 'Generating...' : 'Generate Weekly Insight'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-green-800">
                      Week of {new Date(insight.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-green-900 leading-relaxed">{insight.summary_content}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <WeekCard title="This Week" games={insight.stats_snapshot.this_week_games} wins={insight.stats_snapshot.this_week_wins} winRate={insight.stats_snapshot.this_week_win_rate} />
                  <WeekCard title="Last Week" games={insight.stats_snapshot.last_week_games} wins={insight.stats_snapshot.last_week_wins} winRate={insight.stats_snapshot.last_week_win_rate} />
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleGenerate} disabled={generating} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                    {generating ? 'Refreshing...' : 'Regenerate'}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function WeekCard({ title, games, wins, winRate }: { title: string; games: number; wins: number; winRate: number }) {
  return (
    <Card>
      <CardHeader className="pb-1"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="pt-0 space-y-1">
        <p className="text-2xl font-bold text-gray-900">{Math.round((winRate || 0) * 100)}%</p>
        <p className="text-xs text-gray-500">{wins}W / {games - wins}L ({games} games)</p>
      </CardContent>
    </Card>
  );
}
