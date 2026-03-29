'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // The backend sets an httpOnly cookie (pw_token) on successful login.
      // We do NOT store anything in localStorage.
      const response = await authApi.login(formData);
      
      if (response.data?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-divider">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-main mb-4 text-white font-black text-xl shadow-sm">P</Link>
           <h1 className="text-2xl font-black text-main mb-1 tracking-tight">Welcome Back</h1>
           <p className="text-muted text-sm">Sign in to your PrintWave account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm font-medium leading-relaxed">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-main uppercase tracking-wider">Password</label>
              <Link href="/auth/forgot" className="text-xs font-semibold text-muted hover:text-main transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-divider focus:border-main outline-none transition-all text-sm font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-main text-white font-bold text-sm shadow-sm hover:bg-black transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-divider flex items-center justify-center gap-2 text-sm">
           <span className="text-muted">Don't have an account?</span>
           <Link href="/auth/register" className="font-bold text-main hover:underline">Sign Up Free</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
