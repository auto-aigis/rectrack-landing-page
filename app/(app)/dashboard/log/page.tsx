"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { gamesApi, analyticsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

export default function LogGamePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sport, setSport] = useState('Pickleball');
  const [result, setResult] = useState<'W' | 'L'>('W');
  const [opponentName, setOpponentName] = useState('');
  const [feelingNotes, setFeelingNotes] = useState('');
  const [pointsWon, setPointsWon] = useState('');
  const [pointsLost, setPointsLost] = useState('');
  const [aces, setAces] = useState('');
  const [faults, setFaults] = useState('');
  const [winners, setWinners] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limitError, setLimitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLimitError('');
    setLoading(true);

    const stats: Record<string, number> = {
      points_won: parseInt(pointsWon) || 0,
      points_lost: parseInt(pointsLost) || 0,
      aces: parseInt(aces) || 0,
      faults: parseInt(faults) || 0,
      winners: parseInt(winners) || 0,
      errors: parseInt(errors) || 0,
    };

    try {
      await gamesApi.create(sport, result, opponentName || null, feelingNotes || null, stats);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to log game';
      if (msg.includes('free_tier_limit_reached')) {
        setLimitError('Free tier limit reached. Upgrade to Pro to log more games.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log a Game</h1>
        <p className="text-gray-600">Record your match details below</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {error && <Alert className="mb-4 border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
          {limitError && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-800">
                {limitError}{' '}
                <Link href="/pricing" className="font-semibold hover:underline">
                  View plans
                </Link>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sport">Sport</Label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger id="sport">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pickleball">Pickleball</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="result">Result</Label>
                <Select value={result} onValueChange={(v) => setResult(v as 'W' | 'L')}>
                  <SelectTrigger id="result">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W">Win</SelectItem>
                    <SelectItem value="L">Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="opponent">Opponent Name (optional)</Label>
              <Input id="opponent" value={opponentName} onChange={(e) => setOpponentName(e.target.value)} />
            </div>
            {sport === 'Pickleball' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points-won">Points Won</Label>
                    <Input id="points-won" type="number" value={pointsWon} onChange={(e) => setPointsWon(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="points-lost">Points Lost</Label>
                    <Input id="points-lost" type="number" value={pointsLost} onChange={(e) => setPointsLost(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="aces">Aces</Label>
                    <Input id="aces" type="number" value={aces} onChange={(e) => setAces(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="faults">Faults</Label>
                    <Input id="faults" type="number" value={faults} onChange={(e) => setFaults(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="winners">Winners</Label>
                    <Input id="winners" type="number" value={winners} onChange={(e) => setWinners(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="errors">Errors</Label>
                  <Input id="errors" type="number" value={errors} onChange={(e) => setErrors(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="feeling">How did you feel?</Label>
              <Textarea id="feeling" value={feelingNotes} onChange={(e) => setFeelingNotes(e.target.value)} placeholder="Describe your performance..." />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging...' : 'Log Game'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
