"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { settingsApi, onboardingApi, paddleApi } from '@/app/_lib/api';
import type { Sport } from '@/app/_lib/types';

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [sport, setSport] = useState('');
  const [position, setPosition] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const tier = user?.tier || 'free';
  const isPro = tier === 'pro' || tier === 'elite';

  useEffect(() => {
    onboardingApi.getSports().then(({ sports }) => setSports(sports)).catch(() => {});
    settingsApi.get().then((data) => {
      setSport(data.primary_sport || '');
      setPosition(data.position || '');
    }).catch(() => {});
  }, []);

  const selectedSportData = sports.find((s) => s.name === sport);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await settingsApi.update(sport || undefined, position || undefined, openaiKey || undefined);
      await refresh();
      setSaved(true);
      setOpenaiKey('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (t: 'pro' | 'elite') => {
    setUpgrading(true);
    try {
      const { checkout_url } = await paddleApi.checkout(t);
      window.location.href = checkout_url;
    } catch { setUpgrading(false); }
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>

        <Card>
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                {user?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.display_name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Badge className={`ml-auto ${tier === 'elite' ? 'bg-purple-100 text-purple-700' : tier === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {tier.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sport">Primary Sport</Label>
                <select
                  id="sport"
                  value={sport}
                  onChange={(e) => { setSport(e.target.value); setPosition(''); }}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select sport</option>
                  {sports.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="position">Position / Level</Label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={!sport}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="">Select position</option>
                  {selectedSportData?.positions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="openai">OpenAI API Key (optional)</Label>
              <Input
                id="openai" type="password" value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-... (leave blank to keep existing)"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Used for personalized AI coaching tips</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}
            {saved && <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-3">Settings saved!</div>}

            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Subscription</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 capitalize">{tier} Plan</p>
                <p className="text-xs text-gray-500">
                  {tier === 'free' ? '5 games/month, no AI tips' : tier === 'pro' ? 'Unlimited games, AI tips, trends' : 'All Pro + elite analytics'}
                </p>
              </div>
              <Badge className={tier === 'elite' ? 'bg-purple-100 text-purple-700' : tier === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>
                {tier === 'free' ? 'Free' : tier === 'pro' ? '$12/mo' : '$24/mo'}
              </Badge>
            </div>

            {tier === 'free' && (
              <div className="space-y-2">
                <Button onClick={() => handleUpgrade('pro')} disabled={upgrading} className="w-full bg-green-600 hover:bg-green-700">
                  {upgrading ? 'Loading...' : 'Upgrade to Pro — $12/month'}
                </Button>
                <Button onClick={() => handleUpgrade('elite')} disabled={upgrading} variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                  {upgrading ? 'Loading...' : 'Upgrade to Elite — $24/month'}
                </Button>
              </div>
            )}
            {tier === 'pro' && (
              <Button onClick={() => handleUpgrade('elite')} disabled={upgrading} variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                {upgrading ? 'Loading...' : 'Upgrade to Elite — $24/month'}
              </Button>
            )}
            {isPro && (
              <Button onClick={() => router.push('/settings/subscription')} variant="ghost" className="w-full text-gray-600" size="sm">
                Manage Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
