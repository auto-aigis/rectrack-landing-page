"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/app/_components/AppShell';
import { settingsApi, paddleApi } from '@/app/_lib/api';
import type { Subscription } from '@/app/_lib/types';

export default function SubscriptionPage() {
  const router = useRouter();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    settingsApi.getSubscription().then(setSub).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { portal_url } = await paddleApi.portal();
      window.open(portal_url, '_blank');
    } catch {
      alert('Unable to open billing portal. Contact support.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (tier: 'pro' | 'elite') => {
    try {
      const { checkout_url } = await paddleApi.checkout(tier);
      window.location.href = checkout_url;
    } catch {}
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Subscription</h1>
        </div>

        {loading ? (
          <div className="flex justify-center h-32 items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base">Current Plan</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize text-gray-900">{sub?.tier || 'free'} Plan</span>
                  <Badge className={sub?.tier === 'elite' ? 'bg-purple-100 text-purple-700' : sub?.tier === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>
                    {sub?.status || 'active'}
                  </Badge>
                </div>
                {sub?.current_period_end && (
                  <p className="text-sm text-gray-500">
                    Renews {new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
                {sub?.paddle_subscription_id && (
                  <Button onClick={handlePortal} disabled={portalLoading} variant="outline" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {portalLoading ? 'Opening...' : 'Manage Billing'}
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h2 className="font-semibold text-gray-900">Plans</h2>
              {[
                { tier: 'free' as const, price: '$0', label: 'Free', features: ['5 games/month', 'Basic stats', 'No AI tips'] },
                { tier: 'pro' as const, price: '$12/mo', label: 'Pro', features: ['Unlimited games', 'AI coaching tips', 'Trend charts', 'Weekly insights'] },
                { tier: 'elite' as const, price: '$24/mo', label: 'Elite', features: ['Everything in Pro', 'Season comparison', 'Percentile rankings', 'Multi-sport tracking'] },
              ].map(({ tier, price, label, features }) => (
                <Card key={tier} className={`${sub?.tier === tier ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{label}</span>
                        {sub?.tier === tier && <Badge className="bg-green-100 text-green-700">Current</Badge>}
                      </div>
                      <span className="font-bold text-gray-900">{price}</span>
                    </div>
                    <ul className="space-y-1">
                      {features.map((f) => <li key={f} className="text-sm text-gray-600 flex items-center gap-1"><span className="text-green-500">✓</span>{f}</li>)}
                    </ul>
                    {sub?.tier !== tier && tier !== 'free' && (
                      <Button onClick={() => handleUpgrade(tier)} size="sm" className={`mt-3 w-full ${tier === 'elite' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        Upgrade to {label}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
