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
      const response = await authApi.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-divider fade-in">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4 text-white font-bold text-2xl shadow-lg shadow-accent/20">P</Link>
           <h1 className="text-3xl font-extrabold text-main mb-2">Welcome Back!</h1>
           <p className="text-muted">Please enter your details to sign in</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-main">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-main leading-none">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Link href="/auth/forgot" className="absolute right-0 top-0 mt-[-28px] text-xs font-semibold text-accent hover:underline">Forgot?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg shadow-xl shadow-accent/30 hover:bg-accent-hover transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-divider flex items-center justify-center gap-2 text-sm">
           <span className="text-muted">Don't have an account?</span>
           <Link href="/auth/register" className="font-bold text-accent hover:underline">Sign Up Free</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

