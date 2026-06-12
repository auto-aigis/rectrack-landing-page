"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingsApi, paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import type { Subscription } from '@/app/_lib/types';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [portal, setPortal] = useState('');

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await settingsApi.getSubscription();
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    try {
      const data = await paddleApi.portal();
      window.open(data.portal_url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open portal');
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600">Manage your billing and plan</p>
      </div>
      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Tier</p>
            <Badge className="capitalize mt-1">{subscription?.tier}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium text-gray-900 mt-1 capitalize">{subscription?.status}</p>
          </div>
          {subscription?.current_period_end && (
            <div>
              <p className="text-sm text-gray-600">Renews on</p>
              <p className="font-medium text-gray-900 mt-1">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button onClick={handlePortal} className="w-full">
        Manage via Paddle
      </Button>
      <Link href="/pricing">
        <Button variant="outline" className="w-full">
          View Plans
        </Button>
      </Link>
    </div>
  );
}
