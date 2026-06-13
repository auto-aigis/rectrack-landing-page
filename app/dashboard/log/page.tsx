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
  { key: 'points_won', label: 'Points Won', min: 0 },
  { key: 'points_lost', label: 'Points Lost', min: 0 },
  { key: 'aces', label: 'Aces', min: 0 },
  { key: 'faults', label: 'Faults', min: 0 },
  { key: 'winners', label: 'Winners', min: 0 },
  { key: 'errors', label: 'Errors', min: 0 },
];

const GENERIC_STATS = [
  { key: 'score', label: 'Your Score', min: 0 },
  { key: 'opponent_score', label: "Opponent's Score", min: 0 },
  { key: 'key_stat_1', label: 'Key Stat 1', min: 0 },
  { key: 'key_stat_2', label: 'Key Stat 2', min: 0 },
];

export default function LogGamePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [sport, setSport] = useState(user?.primary_sport || 'Pickleball');
  const [result, setResult] = useState<'W' | 'L'>('W');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    onboardingApi.getSports().then(({ sports }) => setSports(sports)).catch(() => {});
    if (user?.primary_sport) setSport(user.primary_sport);
  }, [user?.primary_sport]);

  const statFields = sport === 'Pickleball' ? PICKLEBALL_STATS : GENERIC_STATS;

  const handleStatChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    setStats((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : Math.max(0, num) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const filledStats: Record<string, number> = {};
      statFields.forEach(({ key }) => { filledStats[key] = stats[key] ?? 0; });
      const game = await gamesApi.create(sport, result, opponent || null, notes || null, filledStats);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/game/${game.id}`), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to log game';
      if (msg.includes('free_tier_limit_reached')) {
        setShowUpgrade(true);
      } else {
        setError(msg);
      }
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

  if (success) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <p className="font-semibold text-gray-900">Game logged!</p>
            <p className="text-sm text-gray-500">Generating your AI coaching tip...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (showUpgrade) {
    return (
      <AppShell>
        <div className="p-4 md:p-6 max-w-md mx-auto">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Monthly Limit Reached
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">You've reached the 5-game monthly limit on the Free plan.</p>
              <p className="text-sm text-gray-600">Upgrade to <strong>Pro ($12/mo)</strong> for unlimited game logging, AI coaching tips, trend charts, and weekly insights.</p>
              <div className="space-y-2">
                <Button onClick={handleUpgrade} disabled={upgrading} className="w-full bg-green-600 hover:bg-green-700">
                  {upgrading ? 'Loading checkout...' : 'Upgrade to Pro — $12/month'}
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">Back to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-lg mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Log Game</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sport">Sport</Label>
              <select
                id="sport"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sports.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                {!sports.length && <option value="Pickleball">Pickleball</option>}
              </select>
            </div>
            <div>
              <Label>Result</Label>
              <div className="mt-1 flex gap-2">
                <button type="button" onClick={() => setResult('W')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition ${result === 'W' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  Win
                </button>
                <button type="button" onClick={() => setResult('L')}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition ${result === 'L' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  Loss
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statFields.map(({ key, label }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key} type="number" min={0}
                  value={stats[key] ?? ''}
                  onChange={(e) => handleStatChange(key, e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="opponent">Opponent (optional)</Label>
            <Input id="opponent" value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Name or team" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="notes">How did it feel? (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about this game..." rows={3} className="mt-1" />
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
            {submitting ? 'Logging...' : 'Log Game'}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
