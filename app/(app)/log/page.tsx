'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { gamesApi } from '@/app/_lib/api';
import Link from 'next/link';

export default function LogGamePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState('');
  const [opponentPartner, setOpponentPartner] = useState('');
  const [servesAttempted, setServesAttempted] = useState('');
  const [servingFaults, setServingFaults] = useState('');
  const [ralliesWon, setRalliesWon] = useState('');
  const [unforcedErrors, setUnforcedErrors] = useState('');
  const [dinks, setDinks] = useState('');
  const [smashes, setSmashes] = useState('');
  const [kitchenViolations, setKitchenViolations] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await gamesApi.create({
        date: new Date(date).toISOString(),
        score,
        opponent_partner_name: opponentPartner || undefined,
        serves_attempted: servesAttempted ? parseInt(servesAttempted) : undefined,
        serving_faults: servingFaults ? parseInt(servingFaults) : undefined,
        rallies_won: ralliesWon ? parseInt(ralliesWon) : undefined,
        unforced_errors: unforcedErrors ? parseInt(unforcedErrors) : undefined,
        dinks: dinks ? parseInt(dinks) : undefined,
        smashes: smashes ? parseInt(smashes) : undefined,
        kitchen_violations: kitchenViolations ? parseInt(kitchenViolations) : undefined,
      });
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to log game';
      if (msg.includes('5 games')) {
        setError('You\'ve reached your monthly limit. Upgrade to Pro for unlimited games!');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Log a Game</h1>
        <p className="text-gray-600 mt-1">Record your pickleball game stats</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  {error.includes('Upgrade') && (
                    <Button variant="link" size="sm" asChild>
                      <Link href="/upgrade">Upgrade</Link>
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Score *</Label>
                <Input
                  id="score"
                  type="text"
                  placeholder="e.g., 11-7"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opponentPartner">Opponent/Partner Name</Label>
              <Input
                id="opponentPartner"
                type="text"
                placeholder="Optional"
                value={opponentPartner}
                onChange={(e) => setOpponentPartner(e.target.value)}
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Game Stats (optional)</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="servesAttempted">Serves Attempted</Label>
                  <Input
                    id="servesAttempted"
                    type="number"
                    min="0"
                    value={servesAttempted}
                    onChange={(e) => setServesAttempted(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servingFaults">Serving Faults</Label>
                  <Input
                    id="servingFaults"
                    type="number"
                    min="0"
                    value={servingFaults}
                    onChange={(e) => setServingFaults(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ralliesWon">Rallies Won</Label>
                  <Input
                    id="ralliesWon"
                    type="number"
                    min="0"
                    value={ralliesWon}
                    onChange={(e) => setRalliesWon(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unforcedErrors">Unforced Errors</Label>
                  <Input
                    id="unforcedErrors"
                    type="number"
                    min="0"
                    value={unforcedErrors}
                    onChange={(e) => setUnforcedErrors(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dinks">Dinks</Label>
                  <Input
                    id="dinks"
                    type="number"
                    min="0"
                    value={dinks}
                    onChange={(e) => setDinks(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smashes">Smashes</Label>
                  <Input
                    id="smashes"
                    type="number"
                    min="0"
                    value={smashes}
                    onChange={(e) => setSmashes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kitchenViolations">Kitchen Violations</Label>
                  <Input
                    id="kitchenViolations"
                    type="number"
                    min="0"
                    value={kitchenViolations}
                    onChange={(e) => setKitchenViolations(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Log Game'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}