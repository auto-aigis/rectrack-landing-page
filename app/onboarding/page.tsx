"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { onboardingApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { Sport } from '@/app/_lib/types';

const SPORT_EMOJI: Record<string, string> = {
  Pickleball: '🏓',
  Soccer: '⚽',
  Softball: '🥎',
  Basketball: '🏀',
  Volleyball: '🏐',
  Tennis: '🎾',
};

export default function OnboardingPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.onboarding_complete) {
      router.replace('/dashboard');
      return;
    }
    onboardingApi.getSports().then(({ sports }) => setSports(sports)).catch(() => {});
  }, [user, router]);

  const selectedSportData = sports.find((s) => s.name === selectedSport);

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setSelectedPosition('');
    setStep(2);
  };

  const handleSave = async () => {
    if (!selectedSport || !selectedPosition) return;
    setSaving(true);
    setError('');
    try {
      await onboardingApi.saveSport(selectedSport, selectedPosition);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to RecTrack!</h1>
          <p className="text-gray-600 mt-1">Let's personalize your experience</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              {s < 2 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}

        {step === 1 ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's your primary sport?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sports.map((sport) => (
                <button
                  key={sport.name}
                  onClick={() => handleSportSelect(sport.name)}
                  className={`p-4 rounded-xl border-2 text-center transition hover:border-green-500 hover:bg-green-50 ${selectedSport === sport.name ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="text-3xl mb-1">{SPORT_EMOJI[sport.name] || '🏅'}</div>
                  <div className="text-sm font-medium text-gray-900">{sport.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
              ← Back to sports
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {SPORT_EMOJI[selectedSport] || '🏅'} {selectedSport}
            </h2>
            <p className="text-gray-600 text-sm mb-4">What best describes your level/position?</p>
            <div className="space-y-2">
              {selectedSportData?.positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-medium transition ${selectedPosition === pos ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'}`}
                >
                  {pos}
                </button>
              ))}
            </div>
            <Button
              onClick={handleSave}
              disabled={!selectedPosition || saving}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 h-12 text-base"
            >
              {saving ? 'Saving...' : "Let's Go! →"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
