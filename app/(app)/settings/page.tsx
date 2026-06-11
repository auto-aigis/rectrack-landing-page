'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Save } from 'lucide-react';
import { profileApi, paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import type { User } from '@/app/_lib/types';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [position, setPosition] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const { user, subscription, refresh } = useAuth();

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setPosition(user.position || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await profileApi.update({ display_name: displayName, position });
      await refresh();
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { portal_url } = await paddleApi.portalUrl();
      window.location.href = portal_url;
    } catch {
      setMessage('No active subscription to manage');
    }
  };

  const positions = [
    { value: 'singles', label: 'Singles' },
    { value: 'doubles-left', label: 'Doubles - Left Side' },
    { value: 'doubles-right', label: 'Doubles - Right Side' },
    { value: 'mixed', label: 'Mixed Doubles' },
  ];

  const tierLabel = subscription?.tier === 'plus'
    ? 'RecTrack Plus'
    : subscription?.tier === 'pro'
    ? 'RecTrack Pro'
    : 'RecTrack Free';

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and subscription</p>
      </div>

      {message && (
        <Alert variant={message.includes('success') ? 'default' : 'destructive'}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name and position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your RecTrack subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{tierLabel}</p>
              {subscription?.current_period_end && (
                <p className="text-sm text-gray-500">
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
              {subscription?.trial_ends_at && subscription.status === 'trialing' && (
                <p className="text-sm text-blue-600">
                  Trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleManageSubscription}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}