"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { gamesApi, paddleApi, onboardingApi } from '@/app/_lib/api';
import type { Sport } from '@/app/_lib/types';

const PICKLEBALL_STATS = [
  { key: 'points_won', label: 'Points Won' },
  { key: 'points_lost', label: 'Points Lost' },
  { key: 'aces', label: 'Aces' },
  { key: 'faults', label: 'Faults' },
  { key: 'winners', label: 'Winners' },
  { key: 'errors', label: 'Errors' },
];

const GENERIC_STATS = [
  { key: 'score', label: 'Your Score' },
  { key: 'opponent_score', label: "Opp. Score" },
  { key: 'key_stat_1', label: 'Key Stat 1' },
  { key: 'key_stat_2', label: 'Key Stat 2' },
];

export default function LogGamePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [sport, setSport] = useState('');
  const [result, setResult] = useState<'W' | 'L'>('W');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [savedGameId, setSavedGameId] = useState('');

  useEffect(() => {
    onboardingApi.getSports().then(({ sports }) => { setSports(sports); }).catch(() => {});
    if (user?.primary_sport) setSport(user.primary_sport);
  }, [user?.primary_sport]);

  const statFields = sport === 'Pickleball' ? PICKLEBALL_STATS : GENERIC_STATS;

  const handleStat = (key: string, val: string) => {
    const n = parseInt(val, 10);
    setStats((p) => ({ ...p, [key]: isNaN(n) ? 0 : Math.max(0, n) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const filled: Record<string, number> = {};
      statFields.forEach(({ key }) => { filled[key] = stats[key] ?? 0; });
      const game = await gamesApi.create(sport, result, opponent || null, notes || null, filled);
      setSavedGameId(game.id);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/game/${game.id}`), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to log game';
      if (msg.includes('free_tier_limit_reached')) setShowUpgrade(true);
      else setError(msg);
      setSubmitting(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { checkout_url } = await paddleApi.checkout('pro');
      window.location.href = checkout_url;
    } catch { setUpgrading(false); }
  };

  if (success) return (
    <AppShell>
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <p className="font-semibold text-gray-900">Game logged!</p>
          <p className="text-sm text-gray-500">Generating AI coaching tip...</p>
        </div>
      </div>
    </AppShell>
  );

  if (showUpgrade) return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-md mx-auto">
        <Card className="border-amber-200">
          <CardHeader><CardTitle className="text-amber-800 flex items-center gap-2"><AlertCircle className="w-5 h-5" />Monthly Limit Reached</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">You've used your 5 free games this month.</p>
            <p className="text-sm text-gray-600">Upgrade to <strong>Pro ($12/mo)</strong> for unlimited logging, AI coaching tips, and more.</p>
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full bg-green-600 hover:bg-green-700">
              {upgrading ? 'Loading checkout...' : 'Upgrade to Pro — $12/month'}
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-lg mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-5">Log Game</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Sport</Label>
              <select value={sport} onChange={(e) => setSport(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {sports.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Result</Label>
              <div className="mt-1 flex gap-2">
                {(['W', 'L'] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setResult(r)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium border transition ${result === r ? (r === 'W' ? 'bg-green-600 text-white border-green-600' : 'bg-red-500 text-white border-red-500') : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {r === 'W' ? 'Win' : 'Loss'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statFields.map(({ key, label }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} type="number" min={0} value={stats[key] ?? ''}
                  onChange={(e) => handleStat(key, e.target.value)} placeholder="0" className="mt-1" />
              </div>
            ))}
          </div>
          <div>
            <Label>Opponent (optional)</Label>
            <Input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Name or team" className="mt-1" />
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it feel?" rows={3} className="mt-1" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
            {submitting ? 'Logging...' : 'Log Game'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
