"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { weeklyApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { WeeklyInsight } from '@/app/_lib/types';

export default function WeeklyPage() {
  const { user } = useAuth();
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user?.tier !== 'free') {
      loadInsight();
    }
  }, [user]);

  const loadInsight = async () => {
    try {
      const data = await weeklyApi.get();
      setInsight(data);
    } catch {
      setError('No insight generated yet');
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const data = await weeklyApi.generate();
      setInsight(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  if (user?.tier === 'free') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Insights</CardTitle>
            <CardDescription>Pro feature - upgrade to access</CardDescription>
          </CardHeader>
          <CardContent>
            <Button href="/pricing" variant="outline">
              View Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Insights</h1>
        <p className="text-gray-600">Your AI-generated weekly performance summary</p>
      </div>
      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
      {insight && (
        <Card>
          <CardHeader>
            <CardTitle>Week of {new Date(insight.week_start).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap">{insight.summary_content}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">This Week Games</p>
                <p className="text-xl font-bold text-gray-900">{insight.stats_snapshot.this_week_games}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Week Games</p>
                <p className="text-xl font-bold text-gray-900">{insight.stats_snapshot.last_week_games}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Button onClick={handleGenerate} disabled={generating} className="w-full">
        {generating ? 'Generating...' : 'Generate New Insight'}
      </Button>
    </div>
  );
}
