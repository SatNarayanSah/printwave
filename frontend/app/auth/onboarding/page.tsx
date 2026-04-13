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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters for better security.');
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
        const refreshedUser = await authApi.me().then(res => res.data.user);
        const role = String(refreshedUser?.role || '').toUpperCase();
        if (role === 'ADMIN') router.push('/admin');
        else if (role === 'DESIGNER') router.push('/designer');
        else router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-700">
        <Card className="w-full max-w-md border-border/40 shadow-2xl rounded-[2.5rem] text-center p-12 space-y-6 bg-background/60 ">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-bounce shadow-inner shadow-emerald-500/20">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Secured!</CardTitle>
            <CardDescription className="text-base font-semibold text-muted-foreground/80">Your password has been updated. One moment while we prepare your dashboard...</CardDescription>
          </div>
          <div className="flex justify-center pt-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--primary-hover)_0%,transparent_25%),radial-gradient(circle_at_bottom_left,var(--accent)_0%,transparent_25%)] opacity-10" />
      
      <Card className="w-full max-w-md border-border/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-background/60">
        <CardHeader className="pt-12 pb-4 px-10 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="p-5 bg-primary/10 rounded-[2rem] text-primary shadow-inner shadow-primary/5 ring-1 ring-primary/20">
              <ShieldCheck className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-black tracking-tight leading-none bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Set Password</CardTitle>
            <CardDescription className="text-sm font-bold text-muted-foreground/70 px-4 leading-relaxed">
              Your account was created by an admin. Please set a custom password to continue safely.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-10 pt-4 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60 ml-1.5 flex items-center gap-2">
                  <Lock className="h-3 w-3" /> New Password
                </Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-muted/30 border-border/40 rounded-2xl font-bold px-5 focus-visible:ring-offset-0 focus-visible:ring-primary/30 focus-visible:bg-background transition-all" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60 ml-1.5 flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Confirm Password
                </Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 bg-muted/30 border-border/40 rounded-2xl font-bold px-5 focus-visible:ring-offset-0 focus-visible:ring-primary/30 focus-visible:bg-background transition-all" 
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[11px] font-black uppercase tracking-tight animate-in shake-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-foreground/90 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-foreground/10 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Continue Studio
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-[9px] text-center text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
            Professional Printing Studio · Secured Access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

