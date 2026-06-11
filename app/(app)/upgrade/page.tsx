'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';
import { paddleApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Loader2 as LoaderIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function loadPaddle() {
  if (typeof window === 'undefined') return;
  if ((window as any).Paddle) return;
  const script = document.createElement('script');
  script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
  script.async = true;
  document.head.appendChild(script);
}

function UpgradeContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const { subscription, refresh, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkout = searchParams.get('checkout');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    loadPaddle();
    const checkPaddle = setInterval(() => {
      if ((window as any).Paddle) {
        setPaddleLoaded(true);
        const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (clientToken) {
          (window as any).Paddle.Environment.set('sandbox');
          (window as any).Paddle.Initialize({ token: clientToken });
        }
        clearInterval(checkPaddle);
      }
    }, 500);
    return () => clearInterval(checkPaddle);
  }, []);

  useEffect(() => {
    if (transactionId && checkout === 'success') {
      const verify = async () => {
        try {
          await paddleApi.verifyTransaction(transactionId);
          await refresh();
          router.push('/dashboard');
        } catch {
          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            try {
              const res = await paddleApi.verifyTransaction(transactionId);
              if (res.status === 'active') {
                clearInterval(poll);
                await refresh();
                router.push('/dashboard');
              }
            } catch {}
            if (attempts >= 20) clearInterval(poll);
          }, 2000);
        }
      };
      verify();
    }
  }, [transactionId, checkout, refresh, router]);

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(tier);
    try {
      const { price_id, client_token } = await paddleApi.checkout(tier);
      if ((window as any).Paddle && price_id) {
        (window as any).Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: 'overlay' },
        });
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setLoading(null);
    }
  };

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      tier: 'free',
      icon: Zap,
      features: [
        '5 games per month',
        'Last 3 games visible',
        '1 AI coaching tip',
      ],
      cta: 'Current Plan',
      current: subscription?.tier === 'free',
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'month',
      tier: 'pro',
      icon: Crown,
      features: [
        'Unlimited games',
        'All game history',
        'AI tips after every game',
        'Performance trend charts',
        'Weekly improvement summary',
        '14-day free trial',
      ],
      cta: subscription?.tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      current: subscription?.tier === 'pro',
    },
    {
      name: 'Plus',
      price: '$24',
      period: 'month',
      tier: 'plus',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Pre-game AI prep',
        'Season summary with benchmarks',
        'CSV export',
        'Achievement system',
        '14-day free trial',
      ],
      cta: subscription?.tier === 'plus' ? 'Current Plan' : 'Upgrade to Plus',
      current: subscription?.tier === 'plus',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Upgrade Your Plan</h1>
        <p className="text-gray-600 mt-1">Choose the plan that fits your game</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.tier} className={t.current ? 'border-blue-300 bg-blue-50' : ''}>
              <CardHeader className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <CardTitle>{t.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{t.price}</span>
                  <span className="text-gray-500">/{t.period}</span>
                </div>
                {t.current && <Badge className="mt-2">Current</Badge>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={t.current ? 'outline' : 'default'}
                  onClick={() => handleSubscribe(t.tier)}
                  disabled={loading !== null || t.current}
                >
                  {loading === t.tier ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}  
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  );
}