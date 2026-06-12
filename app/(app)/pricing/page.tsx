"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';
import { Check } from 'lucide-react';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started',
    features: [
      'Log up to 5 games/month',
      'Basic stats view',
      'No AI coaching tips',
      'No trend charts',
    ],
    tier: 'free',
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'Most popular',
    features: [
      'Unlimited game logging',
      'AI post-game coaching tips',
      'Performance trend charts',
      'Weekly AI insights',
      'Pre-game prep tips',
      'Logging streak tracking',
    ],
    tier: 'pro',
    highlighted: true,
  },
  {
    name: 'Elite',
    price: '$24',
    period: '/month',
    description: 'Advanced features',
    features: [
      'Everything in Pro',
      'Percentile rankings',
      'Season-over-season comparison',
      'Priority AI generation',
      'Multi-sport tracking',
      'Early access to new features',
    ],
    tier: 'elite',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleCheckout = async (tier: 'pro' | 'elite') => {
    setLoading(tier);
    setError('');
    try {
      const data = await paddleApi.checkout(tier);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-gray-600">Choose the plan that works for you</p>
      </div>
      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
      <div className="grid md:grid-cols-3 gap-6">
        {TIERS.map((plan) => (
          <Card key={plan.tier} className={plan.highlighted ? 'border-blue-500 border-2 md:scale-105' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.highlighted && <Badge>Popular</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-600">{plan.period}</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.tier === 'free' ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleCheckout(plan.tier as 'pro' | 'elite')}
                  disabled={loading === plan.tier}
                  className="w-full"
                >
                  {loading === plan.tier ? 'Processing...' : 'Get ' + plan.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
