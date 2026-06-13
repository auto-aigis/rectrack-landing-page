"use client";

import { useState } from 'react';
import { Check, Zap, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/app/_components/AppShell';
import { useAuth } from '@/app/_lib/hooks';
import { paddleApi } from '@/app/_lib/api';

const PLANS = [
  {
    tier: 'free' as const,
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: <Star className="w-6 h-6 text-gray-400" />,
    color: 'border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-700',
    features: [
      '5 games per month',
      'Basic stat tracking',
      'Win/loss history',
      'Season summary',
    ],
    locked: [
      'AI coaching tips',
      'Trend charts',
      'Weekly insights',
    ],
  },
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '$12',
    period: '/month',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    color: 'border-green-500',
    badgeColor: 'bg-green-100 text-green-700',
    highlight: true,
    features: [
      'Unlimited game logging',
      'AI coaching tips (GPT-4o)',
      'Performance trend charts',
      'Weekly AI insights',
      'All Free features',
    ],
  },
  {
    tier: 'elite' as const,
    name: 'Elite',
    price: '$24',
    period: '/month',
    icon: <Trophy className="w-6 h-6 text-purple-500" />,
    color: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-700',
    features: [
      'Everything in Pro',
      'Season-over-season comparison',
      'Percentile rankings vs all users',
      'Multi-sport tracking',
      'Priority AI generation',
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const currentTier = user?.tier || 'free';

  const handleUpgrade = async (tier: 'pro' | 'elite') => {
    setUpgrading(tier);
    try {
      const { checkout_url } = await paddleApi.checkout(tier);
      window.location.href = checkout_url;
    } catch {
      setUpgrading(null);
    }
  };

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-600 mt-1">Unlock AI coaching and advanced analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <Card key={plan.tier} className={`relative border-2 ${plan.color} ${plan.highlight ? 'shadow-lg' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-green-600 text-white px-3">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-center gap-2 mb-1">
                  {plan.icon}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.locked?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400 line-through">
                      <Check className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {currentTier === plan.tier ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : plan.tier === 'free' ? (
                  <Button disabled variant="outline" className="w-full">Free Forever</Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={upgrading !== null}
                    className={`w-full ${plan.tier === 'elite' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {upgrading === plan.tier ? 'Loading checkout...' : `Upgrade to ${plan.name}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            All plans include a 7-day free trial. Cancel anytime. Powered by{' '}
            <span className="font-medium">Paddle</span> — secure checkout & billing.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
