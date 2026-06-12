"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingsApi, onboardingApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { Sport } from '@/app/_lib/types';

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [primarySport, setPrimarySport] = useState('');
  const [position, setPosition] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [masked, setMasked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSports();
    loadSettings();
  }, []);

  const loadSports = async () => {
    try {
      const data = await onboardingApi.getSports();
      setSports(data.sports);
    } catch {}
  };

  const loadSettings = async () => {
    try {
      const data = await settingsApi.get();
      setPrimarySport(data.primary_sport || '');
      setPosition(data.position || '');
      setMasked(!!data.api_keys?.openai);
    } catch {}
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await settingsApi.update(primarySport || undefined, position || undefined, apiKey || undefined);
      setSuccess('Settings updated!');
      setApiKey('');
      await refresh();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const currentSport = sports.find((s) => s.name === primarySport);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
      {success && <Alert className="border-green-200 bg-green-50"><AlertDescription className="text-green-800">{success}</AlertDescription></Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Sport & Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sport">Primary Sport</Label>
            <Select value={primarySport} onValueChange={setPrimarySport}>
              <SelectTrigger id="sport">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sports.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentSport && (
            <div>
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentSport.positions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
          <CardDescription>Used to generate AI coaching tips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {masked && !apiKey && <Alert><AlertDescription>API key is configured (masked for security)</AlertDescription></Alert>}
          <div>
            <Label htmlFor="apiKey">Key</Label>
            <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk_..." />
          </div>
          <p className="text-xs text-gray-600">Leave blank to keep current key</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/settings/subscription">
            <Button variant="outline">Manage Subscription</Button>
          </Link>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
