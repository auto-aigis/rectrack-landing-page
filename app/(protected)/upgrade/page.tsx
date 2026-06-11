'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/_components/AuthProvider';
import { useRouter } from 'next/navigation';
import { paymentApi } from '@/app/_lib/api';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Log up to 10 matches/month',
      'Basic statistics',
      'Single game mode',
    ],
    tier: 'free',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited matches',
      'Advanced analytics',
      'All game modes',
      'Priority support',
    ],
    tier: 'pro',
  },
];

export default function UpgradePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (tier === 'free') return;

    setLoading(tier);
    try {
      const { url } = await paymentApi.createCheckoutSession({ tier, billing_interval: 'month' });
      window.location.href = url;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Plan</h1>
        <p className="text-muted-foreground mt-2">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.name === 'Pro' ? 'border-blue-500 border-2' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.tier === 'free' ? 'For casual players' : 'For serious players'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
                disabled={user?.tier === plan.tier || loading !== null}
                onClick={() => handleUpgrade(plan.tier)}
              >
                {loading === plan.tier
                  ? 'Loading...'
                  : user?.tier === plan.tier
                  ? 'Current Plan'
                  : plan.tier === 'free'
                  ? 'Current Plan'
                  : 'Upgrade'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}