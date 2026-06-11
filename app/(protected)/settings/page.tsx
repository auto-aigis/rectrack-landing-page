'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/app/_components/AuthProvider';
import { profileApi } from '@/app/_lib/api';

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [position, setPosition] = useState(user?.position || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await profileApi.updateProfile({ display_name: displayName, position });
      await refresh();
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Playing Position</Label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
              >
                <option value="">Select position</option>
                <option value="singles">Singles</option>
                <option value="doubles-left">Doubles - Left Side</option>
                <option value="doubles-right">Doubles - Right Side</option>
                <option value="mixed">Mixed Doubles</option>
              </select>
            </div>

            {success && (
              <div className="text-sm text-green-600">Profile updated successfully</div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}