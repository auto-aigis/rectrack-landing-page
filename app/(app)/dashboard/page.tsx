"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/app/_lib/hooks";
import { dashboardApi } from "@/app/_lib/api";
import { DashboardData } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentsApi } from "@/app/_lib/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const { subscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaidUI, setShowPaidUI] = useState(false);

  const transaction_id = searchParams.get("transaction_id");
  const checkout = searchParams.get("checkout");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dash = await dashboardApi.get();
        setData(dash);

        if (transaction_id && checkout === "success") {
          setProcessing(true);
          setShowPaymentSuccess(true);

          try {
            const result = await paymentsApi.verifyTransaction(transaction_id);
            if (result.status === "active") {
              setShowPaidUI(true);
              const params = new URLSearchParams();
              window.history.replaceState({}, "", window.location.pathname);
            }
          } catch {}
          setProcessing(false);
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [transaction_id, checkout]);

  useEffect(() => {
    if (data?.milestone_to_show) {
      const timer = setTimeout(() => {
        dashboardApi.milestoneSeen(data.milestone_to_show!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data?.milestone_to_show]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-gray-500">Failed to load dashboard</p>
      </div>
    );
  }

  const isPaid = showPaidUI || data.subscription.tier !== "free";
  const streakMessage =
    data.streak_weeks === 0
      ? "🔥 Start your streak — log a game!"
      : `🔥 ${data.streak_weeks}-week streak`;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {data.milestone_to_show && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center animate-pulse">
          <p className="text-lg font-semibold text-blue-900">
            🎉 {data.milestone_to_show}-week streak! You&apos;re on fire.
          </p>
        </div>
      )}

      {showPaymentSuccess && processing && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-900">Payment processing... please wait</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{streakMessage}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            You have logged games in {data.streak_weeks} consecutive weeks.
          </p>
          <Link href="/games/log">
            <Button className="mt-4">Log This Week's Game</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_games.length === 0 ? (
            <p className="text-gray-500">No games logged yet</p>
          ) : (
            <div className="space-y-4">
              {data.recent_games.map((game) => (
                <div
                  key={game.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {game.sport}
                      </p>
                      <p className="text-sm text-gray-600">
                        {game.position} •{" "}
                        {new Date(game.played_at).toLocaleDateString()}
                      </p>
                      {game.notes && (
                        <p className="text-sm text-gray-700 mt-2">{game.notes}</p>
                      )}
                    </div>
                    <Link href={`/games/${game.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isPaid && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Unlock Pro Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Upgrade to Pro for unlimited game logging and full AI coaching tips.
            </p>
            <Link href="/pricing">
              <Button>View Pricing</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}