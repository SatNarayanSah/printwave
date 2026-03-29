'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please check the link in your email.');
        return;
      }
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be expired or invalid.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-divider text-center">
        {status === 'loading' && (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-divider border-t-main animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-black text-main mb-2">Verifying your email...</h2>
            <p className="text-muted text-sm">Please wait while we confirm your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-main mb-3 tracking-tight">Email Verified!</h2>
            <p className="text-muted text-sm font-medium leading-relaxed mb-8">{message}</p>
            <Link 
              href="/auth/login" 
              className="inline-block px-10 py-3.5 rounded-xl bg-main text-white font-bold text-sm hover:bg-black transition-all shadow-sm"
            >
              Sign In to Your Account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-main mb-3 tracking-tight">Verification Failed</h2>
            <p className="text-muted text-sm font-medium leading-relaxed mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/auth/register" 
                className="px-10 py-3.5 rounded-xl bg-main text-white font-bold text-sm hover:bg-black transition-all shadow-sm"
              >
                Register Again
              </Link>
              <Link href="/auth/login" className="text-sm font-bold text-muted hover:text-main transition-colors">
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
