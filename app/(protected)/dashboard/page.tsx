'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/_components/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    if (upgraded === 'true') {
      // Could show a toast here
    }
  }, [searchParams]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.display_name || 'Player'}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-- days</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent matches and sessions will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity. Start logging matches to see your history!
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => router.push('/log')}>
              Log New Match
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/history')}>
              View History
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/upgrade')}>
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}