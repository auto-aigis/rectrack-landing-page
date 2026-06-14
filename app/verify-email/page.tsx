"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [verifying, setVerifying] = useState(!!token);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          const res = await fetch("/api/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: "include",
          });
          if (res.ok) {
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
          } else {
            const err = await res.json();
            setError(
              err.detail || "Verification failed. Please try again."
            );
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Verification failed. Please try again."
          );
        } finally {
          setVerifying(false);
        }
      };
      verify();
    }
  }, [token, router]);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Resend failed:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          {verifying && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {success && (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-semibold">✓ Email verified!</p>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          )}

          {error && !verifying && (
            <div className="text-center space-y-4">
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}

          {!token && email && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Check your inbox — we sent a verification link to{" "}
                <strong>{email}</strong>.
              </p>
              <Button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full"
              >
                {resendSuccess
                  ? "Email sent!"
                  : resendLoading
                    ? "Sending..."
                    : "Resend verification email"}
              </Button>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}