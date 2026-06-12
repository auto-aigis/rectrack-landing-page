"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { onboardingApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { Sport } from '@/app/_lib/types';

export default function OnboardingPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      const data = await onboardingApi.getSports();
      setSports(data.sports);
      if (data.sports.length > 0) setSelectedSport(data.sports[0].name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sports');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await onboardingApi.saveSport(selectedSport, selectedPosition);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const currentSport = sports.find((s) => s.name === selectedSport);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Select Your Sport</CardTitle>
          <CardDescription>Choose your primary sport and position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Sport</label>
              <div className="space-y-2">
                {sports.map((sport) => (
                  <button
                    key={sport.name}
                    onClick={() => {
                      setSelectedSport(sport.name);
                      setSelectedPosition(sport.positions[0]);
                    }}
                    className={`w-full p-3 text-left rounded-lg border transition ${
                      selectedSport === sport.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            </div>
            {currentSport && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Position</label>
                <div className="space-y-2">
                  {currentSport.positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`w-full p-3 text-left rounded-lg border transition ${
                        selectedPosition === pos ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleSubmit} disabled={!selectedSport || !selectedPosition || loading} className="w-full">
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
