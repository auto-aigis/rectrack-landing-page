"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { gamesApi, paddleApi } from '@/app/_lib/api';
import type { Game, AITip } from '@/app/_lib/types';

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [tip, setTip] = useState<AITip | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipLoading, setTipLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const isPro = user?.tier === 'pro' || user?.tier === 'elite';

  useEffect(() => {
    gamesApi.get(id).then(setGame).catch(() => {}).finally(() => setLoading(false));
    if (isPro) gamesApi.getInsight(id).then(setTip).catch(() => {}).finally(() => setTipLoading(false));
    else setTipLoading(false);
  }, [id, isPro]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try { window.location.href = (await paddleApi.checkout('pro')).checkout_url; }
    catch { setUpgrading(false); }
  };

  if (loading) return <AppShell><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div></AppShell>;

  if (!game) return <AppShell><div className="p-4 text-center"><p className="text-gray-500">Game not found</p><Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-4">Back</Button></div></AppShell>;

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="flex items-center gap-4">
          <span className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${game.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {game.result}
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{game.sport}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(game.logged_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {game.opponent_name && ` · vs ${game.opponent_name}`}
            </p>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(game.stats).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {game.feeling_notes && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent className="pt-0"><p className="text-gray-700 text-sm leading-relaxed">{game.feeling_notes}</p></CardContent>
          </Card>
        )}
        {isPro ? (
          <Card className={tip ? 'border-blue-200 bg-blue-50' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <Zap className="w-4 h-4" /> AI Coaching Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {tipLoading ? (
                <div className="flex items-center gap-2 text-blue-600"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" /><span className="text-sm">Generating your tip...</span></div>
              ) : tip ? (
                <p className="text-blue-900 text-sm leading-relaxed">{tip.content}</p>
              ) : (
                <p className="text-sm text-gray-500">No tip available for this game yet.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center space-y-3">
              <Lock className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="font-medium text-gray-700">AI Coaching Tips — Pro Feature</p>
              <p className="text-xs text-gray-500">Get personalized GPT-4o coaching tips after every game</p>
              <Button onClick={handleUpgrade} disabled={upgrading} size="sm" className="bg-green-600 hover:bg-green-700">
                {upgrading ? 'Loading...' : 'Upgrade to Pro — $12/mo'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
