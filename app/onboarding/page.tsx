'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { profileApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await profileApi.completeOnboarding({ display_name: displayName, position });
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  const positions = [
    { value: 'singles', label: 'Singles' },
    { value: 'doubles-left', label: 'Doubles - Left Side' },
    { value: 'doubles-right', label: 'Doubles - Right Side' },
    { value: 'mixed', label: 'Mixed Doubles' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Welcome to RecTrack</CardTitle>
          <CardDescription>Let&apos;s set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="How should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Sport</Label>
              <div className="p-3 bg-gray-100 rounded-lg text-gray-900 font-medium">
                Pickleball
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Playing Position</Label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                required
              >
                <option value="">Select your position</option>
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting up...' : 'Get Started'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}