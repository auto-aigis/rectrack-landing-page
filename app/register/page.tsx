"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/app/_lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authApi.register(email, password, displayName);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-4xl">🏆</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">RecTrack</h1>
          <p className="text-gray-500 text-sm">Start tracking your sports performance</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Free forever — no credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">{error}</div>}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Your name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="8+ characters" className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? 'Creating account...' : 'Create Free Account'}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-green-600 hover:underline font-medium">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
