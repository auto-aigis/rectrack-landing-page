"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverified(false);
    setLoading(true);
    try {
      await authApi.login(email, password);
      const user = await authApi.me();
      await refresh();
      if (!user.onboarding_complete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('email_not_verified')) setUnverified(true);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendDone(false);
    try {
      await authApi.resendVerification(email);
      setResendDone(true);
      setTimeout(() => setResendDone(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🏆</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">RecTrack</h1>
          <p className="text-gray-500 text-sm">Track your sports performance</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}
              {unverified && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3">
                  Please verify your email first.
                </div>
              )}
              {resendDone && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-3">
                  Verification email sent! Check your inbox.
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
              </div>
              {unverified && (
                <Button onClick={handleResend} disabled={resending} variant="outline" className="w-full" type="button">
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              )}
              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-green-600 hover:underline font-medium">Sign up free</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
