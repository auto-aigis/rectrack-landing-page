"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { dashboardApi, gamesApi, paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { DashboardData } from '@/app/_lib/types';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [polling, setPolling] = useState(false);

  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId && !verified) {
      verifyTransaction();
    }
  }, [checkoutSuccess, transactionId]);

  const verifyTransaction = async () => {
    setPolling(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/paddle/verify-transaction`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      setVerified(true);
      router.replace('/dashboard');
    } catch {
      setTimeout(verifyTransaction, 2000);
    } finally {
      setPolling(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const result = await dashboardApi.getData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <Alert className="m-6 border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>;
  if (!data) return <div className="p-6 text-center text-gray-600">No data</div>;

  if (polling) {
    return <div className="p-6 text-center text-gray-600">Payment processing... please wait</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {checkoutSuccess && <Alert className="border-green-200 bg-green-50"><AlertDescription className="text-green-800">Payment successful! Welcome to Pro tier.</AlertDescription></Alert>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.total_games}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(data.win_rate * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{user?.tier !== 'free' ? data.current_streak : '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="capitalize">{user?.tier}</Badge>
          </CardContent>
        </Card>
      </div>
      {data.pre_game_tip && user?.tier !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pre-Game Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{data.pre_game_tip.content}</p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
          <CardDescription>{data.recent_games.length} games</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recent_games.length === 0 ? (
            <p className="text-gray-600">No games logged yet</p>
          ) : (
            <div className="space-y-2">
              {data.recent_games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{game.sport}</p>
                    <p className="text-sm text-gray-600">{new Date(game.logged_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={game.result === 'W' ? 'default' : 'secondary'}>{game.result}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Link href="/dashboard/log">
        <Button className="w-full" size="lg">
          Log a Game
        </Button>
      </Link>
      {user?.tier === 'free' && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            Free tier: {5 - (data.total_games % 5)} games remaining this month.{' '}
            <Link href="/pricing" className="font-semibold hover:underline">
              Upgrade to Pro
            </Link>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
