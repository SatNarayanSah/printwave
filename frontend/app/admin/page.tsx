'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/authContext';
import { adminApi } from '@/lib/api';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    adminApi
      .dashboard()
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message ?? 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Please login</h1>
            <p className="text-muted-foreground">Login to access the admin dashboard.</p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">Go to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (String(user.role).toUpperCase() !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-3">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Not authorized</h1>
            <p className="text-muted-foreground">This page requires admin access.</p>
            <Link href="/">
              <Button variant="outline" className="w-full">Back home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Admin</h1>
            <p className="text-muted-foreground mt-2">Dashboard overview (raw JSON for now).</p>
          </div>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <Card className="py-0">
          <CardContent className="p-6">
            {loading ? (
              <p className="text-muted-foreground">Loading dashboard...</p>
            ) : (
              <pre className="text-xs bg-muted/60 p-4 rounded-xl overflow-auto border border-border/60">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

