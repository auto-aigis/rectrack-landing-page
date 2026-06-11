'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Trophy, Calendar } from 'lucide-react';
import { gamesApi, tipsApi, paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import type { Game, CoachingTip } from '@/app/_lib/types';
import Link from 'next/link';

function DashboardContent() {
  const [games, setGames] = useState<Game[]>([]);
  const [tip, setTip] = useState<CoachingTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipLoading, setTipLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { subscription, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isProOrPlus = subscription?.tier === 'pro' || subscription?.tier === 'plus';
  const isPlus = subscription?.tier === 'plus';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gamesData, tipData] = await Promise.all([
          gamesApi.list(5),
          tipsApi.latest().catch(() => ({ tip_text: null, generated_at: null })),
        ]);
        setGames(gamesData);
        setTip(tipData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const checkout = searchParams.get('checkout');

    if (transactionId && checkout === 'success') {
      setProcessingPayment(true);
      paddleApi.verifyTransaction(transactionId)
        .then(async () => {
          await refresh();
          window.location.href = '/dashboard';
        })
        .catch(() => {
          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            try {
              const sub = await paddleApi.verifyTransaction(transactionId);
              if (sub.status === 'active') {
                clearInterval(poll);
                await refresh();
                window.location.href = '/dashboard';
              }
            } catch {}
            if (attempts >= 20) {
              clearInterval(poll);
              setProcessingPayment(false);
            }
          }, 2000);
        });
    }
  }, [searchParams, refresh]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const recentGames = games.slice(0, isProOrPlus ? 5 : 3);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your performance and improve your game</p>
        </div>
        <Badge variant={isProOrPlus ? 'default' : 'secondary'} className="hidden md:flex">
          {isPlus ? 'RecTrack Plus' : isProOrPlus ? 'RecTrack Pro' : 'RecTrack Free'}
        </Badge>
      </div>

      {processingPayment && (
        <Alert>
          <Loader2 className="w-4 h-4 animate-spin" />
          <AlertDescription>Processing payment... please wait</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Games Played</CardDescription>
            <CardTitle className="text-3xl">{games.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="text-3xl">
              {games.length > 0
                ? Math.round(
                    (games.filter((g) => {
                      const scoreParts = g.score.split('-');
                      return parseInt(scoreParts[0]) > parseInt(scoreParts[1] || '0');
                    }).length /
                      games.length) *
                      100
                  )
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              {games.length > 0 ? 'Keep it up!' : '-'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGames.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No games logged yet</p>
            ) : (
              <div className="space-y-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{game.score}</p>
                      <p className="text-sm text-gray-500">{formatDate(game.date)}</p>
                    </div>
                    {game.unforced_errors !== null && (
                      <Badge variant="outline">
                        {game.unforced_errors} UE
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button asChild className="w-full mt-4">
              <Link href="/log">Log a Game</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              AI Coaching Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tipLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating tip...
              </div>
            ) : tip?.tip_text ? (
              <p className="text-gray-700 leading-relaxed">{tip.tip_text}</p>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">Log a game to get your first coaching tip!</p>
                {!isProOrPlus && (
                  <Button variant="outline" asChild>
                    <Link href="/upgrade">Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isProOrPlus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Unlock Pro Features</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get unlimited games, trend charts, and tips after every game
                </p>
              </div>
              <Button asChild>
                <Link href="/upgrade">Upgrade</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}