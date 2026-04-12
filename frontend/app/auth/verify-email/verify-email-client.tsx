'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    authApi
      .verifyEmail(token)
      .then((res) => {
        if (cancelled) return;
        setStatus('success');
        setMessage(res.message || 'Email verified successfully.');
      })
      .catch((err: any) => {
        if (cancelled) return;
        setStatus('error');
        setMessage(err?.message ?? 'Verification failed');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="w-full max-w-md border border-border rounded-lg bg-card p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">Verify Email</h1>

      {status === 'loading' && <p className="text-muted-foreground">Verifying...</p>}
      {status !== 'loading' && (
        <p className={status === 'error' ? 'text-destructive' : 'text-muted-foreground'}>{message}</p>
      )}

      <Link href="/auth/login">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">Go to Login</Button>
      </Link>
    </div>
  );
}

