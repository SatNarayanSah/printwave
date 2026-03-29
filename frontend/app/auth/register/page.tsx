'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center container mx-auto px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-divider fade-in">
        <div className="text-center mb-10">
           <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4 text-white font-bold text-2xl shadow-lg shadow-accent/20">P</Link>
           <h1 className="text-3xl font-extrabold text-main mb-2">Join PrintWave Today</h1>
           <p className="text-muted">Start creating your own unique custom products</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-main leading-none">First Name</label>
            <input 
              type="text" 
              required
              placeholder="John"
              className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-main leading-none">Last Name</label>
            <input 
              type="text" 
              required
              placeholder="Doe"
              className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="col-span-full space-y-2">
            <label className="text-sm font-semibold text-main leading-none">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="col-span-full space-y-2">
            <label className="text-sm font-semibold text-main leading-none">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-5 py-3 rounded-xl bg-primary-bg border border-divider focus:border-accent ring-0 transition-all text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="col-span-full pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg shadow-xl shadow-accent/30 hover:bg-accent-hover transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Processing...' : 'Create My Account'}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-divider text-center text-sm">
           <span className="text-muted">Already a member?</span>
           <Link href="/auth/login" className="font-bold text-accent hover:underline ml-2">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

