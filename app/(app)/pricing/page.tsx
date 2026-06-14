"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricingTier {
  name: string;
  price: number;
  priceId: string | null;
  description: string;
  features: string[];
  highlighted: boolean;
}

export default function PricingPage() {
  const { user, subscription } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPaddle = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => {
        const Paddle = (window as any).Paddle;
        if (Paddle) {
          Paddle.Environment.set("sandbox");
          Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
            eventCallback: handlePaddleEvent,
          });
        }
      };
      document.head.appendChild(script);
    };
    loadPaddle();
  }, []);

  const handlePaddleEvent = (data: any) => {
    if (data.name === "checkout.completed") {
      const transaction_id = data.data.transaction_id;
      if (transaction_id) {
        window.location.href = `/dashboard?checkout=success&transaction_id=${transaction_id}`;
      }
    }
  };

  const handleCheckout = (priceId: string | null) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!priceId) return;

    const Paddle = (window as any).Paddle;
    if (Paddle) {
      Paddle.Checkout.open({ items: [{ priceId }] });
    }
  };

  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: 0,
      priceId: null,
      description: "Perfect for getting started",
      features: [
        "5 games per month",
        "Basic game logging",
        "Teaser AI coaching tips",
        "Streak counter",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: 12,
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO ?? null,
      description: "Unlock full AI coaching",
      features: [
        "Unlimited game logging",
        "Full AI coaching tips",
        "Weekly performance emails",
        "Streak counter",
        "Advanced stats tracking",
      ],
      highlighted: true,
    },
    {
      name: "Elite",
      price: 24,
      priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_ELITE ?? null,
      description: "For serious athletes",
      features: [
        "Everything in Pro",
        "Advanced analytics",
        "Percentile rankings",
        "Multi-sport support",
        "Priority AI coaching",
      ],
      highlighted: false,
    },
  ];

  const currentTier = subscription?.tier || "free";

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600">
          Choose the plan that fits your athletic journey
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentTier = currentTier === tier.name.toLowerCase();
          return (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.highlighted
                  ? "border-blue-300 shadow-lg scale-105"
                  : "border-gray-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {isCurrentTier && (
                    <Badge className="bg-green-100 text-green-800">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    ${tier.price}
                  </p>
                  <p className="text-sm text-gray-600">/month</p>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(tier.priceId)}
                  disabled={isCurrentTier || loading}
                  className={`w-full ${
                    tier.highlighted ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  {isCurrentTier
                    ? "Current Plan"
                    : tier.name === "Free"
                      ? "Downgrade"
                      : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}