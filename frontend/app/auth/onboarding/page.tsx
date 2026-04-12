'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { authApi } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // If user is already verified and onboarding is not required, redirect home
  // In a real app, the refresh() would update the user state with mustChangePassword: false
  // For now, we rely on the backend to enforce this.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await authApi.completeOnboarding({ password });
      setSuccess(true);
      // Wait a moment then refresh auth state and redirect
      setTimeout(async () => {
        await refresh();
        router.push(user?.role === 'ADMIN' || user?.role === 'DESIGNER' ? '/admin' : '/');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-700">
        <Card className="w-full max-w-md border-border/40 shadow-2xl rounded-[2rem] text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tight">Security Updated!</CardTitle>
            <CardDescription className="text-base font-medium">Your password has been changed successfully. Redirecting you to your dashboard...</CardDescription>
          </div>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary opacity-50" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Card className="w-full max-w-md border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/40 backdrop-blur-sm">
        <CardHeader className="pt-10 pb-2 px-10 text-center space-y-3">
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-primary/10 rounded-3xl text-primary">
              <ShieldCheck className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight">Set Secure Password</CardTitle>
            <CardDescription className="text-sm font-medium px-4">
              An administrator has created your account. To ensure security, please set a new custom password before continuing.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-10 pt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">New Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-primary/40 transition-all" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-primary/40 transition-all" 
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold animate-in shake-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? 'Setting Password...' : 'Complete Onboarding'}
            </Button>
          </form>

          <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-tighter opacity-70">
            Professional Custom Printing · Persomith Security
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
