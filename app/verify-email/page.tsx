"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_lib/hooks';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (token && !loading) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    setLoading(true);
    try {
      await authApi.verifyEmail(token || '');
      setVerified(true);
      await refresh();
      setTimeout(() => router.push('/onboarding'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendDone(false);
    try {
      await authApi.resendVerification(email);
      setResendDone(true);
      setTimeout(() => setResendDone(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return <Alert className="border-green-200 bg-green-50"><AlertDescription className="text-green-800">Email verified! Redirecting to onboarding...</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-4">
      {token ? (
        <>
          {loading && <Alert className="border-blue-200 bg-blue-50"><AlertDescription className="text-blue-800">Verifying your email...</AlertDescription></Alert>}
          {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
        </>
      ) : (
        <>
          <p className="text-gray-700">
            We sent a verification link to <strong>{email}</strong>. Please check your email.
          </p>
          {resendDone && <Alert className="border-green-200 bg-green-50"><AlertDescription className="text-green-800">Email sent! Check your inbox.</AlertDescription></Alert>}
          <div className="flex gap-2">
            <Button onClick={handleResend} disabled={resending} variant="outline" className="flex-1">
              {resending ? 'Sending...' : 'Resend Email'}
            </Button>
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Check your inbox for the verification link</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center text-gray-600">Loading...</div>}>
            <VerifyEmailContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
