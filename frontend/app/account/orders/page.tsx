'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/authContext';
import { ordersApi } from '@/lib/api';
import type { OrderDto } from '@/lib/api/types';

const toNumber = (v: unknown) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    ordersApi
      .listMine()
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message ?? 'Failed to load orders');
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
            <p className="text-muted-foreground">Login to view your orders.</p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">Go to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">My orders</h1>
            <p className="text-muted-foreground mt-2">Track and manage your purchases.</p>
          </div>
          <Link href="/account/designs">
            <Button variant="outline">My designs</Button>
          </Link>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        {loading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <Card className="py-0">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <Link href="/shop">
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Start shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Card key={o.id} className="py-0">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: {o.status} • Payment: {o.paymentStatus}
                    </p>
                    <p className="text-xs text-muted-foreground">Total: ${toNumber(o.total).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await ordersApi.cancel(o.id);
                          const res = await ordersApi.listMine();
                          setOrders(res.data);
                        } catch (e: any) {
                          setError(e?.message ?? 'Cancel failed');
                        }
                      }}
                      disabled={String(o.status).toUpperCase() !== 'PENDING'}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

