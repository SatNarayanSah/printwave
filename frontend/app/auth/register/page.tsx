'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.register(formData);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-divider text-center">
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-main mb-3 tracking-tight">Check Your Inbox</h2>
          <p className="text-muted text-sm font-medium leading-relaxed mb-2">
            We've sent a verification link to <span className="font-bold text-main">{formData.email}</span>.
          </p>
          <p className="text-muted text-sm font-medium leading-relaxed mb-8">
            Please click the link in that email to activate your account before logging in.
          </p>
          <p className="text-xs text-muted/70">
            Didn't receive the email? Check your spam folder or{' '}
            <button onClick={() => setSuccess(false)} className="underline hover:text-main transition-colors">
              try again
            </button>.
          </p>
          <div className="mt-8 pt-6 border-t border-divider">
            <Link href="/auth/login" className="inline-block px-8 py-3 rounded-xl bg-main text-white text-sm font-bold hover:bg-black transition-all">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center container mx-auto px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-divider">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-main mb-4 text-white font-black text-xl shadow-sm">P</Link>
           <h1 className="text-2xl font-black text-main mb-1 tracking-tight">Create Your Account</h1>
           <p className="text-muted text-sm">Join PrintWave and start creating unique custom products</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm font-medium">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-main uppercase tracking-wider">First Name</label>
            <input 
              type="text" 
              required
              placeholder="John"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-divider focus:border-main outline-none transition-all text-sm font-medium"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-main uppercase tracking-wider">Last Name</label>
            <input 
              type="text" 
              required
              placeholder="Doe"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-divider focus:border-main outline-none transition-all text-sm font-medium"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <label className="text-xs font-bold text-main uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-divider focus:border-main outline-none transition-all text-sm font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <label className="text-xs font-bold text-main uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="Minimum 6 characters"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-divider focus:border-main outline-none transition-all text-sm font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="col-span-full pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-main text-white font-bold text-sm shadow-sm hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-divider text-center text-sm">
           <span className="text-muted">Already have an account?</span>
           <Link href="/auth/login" className="font-bold text-main hover:underline ml-2">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
