'use client';

import * as React from 'react';
import {
  ShoppingBag,
  Search,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { designerApi } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  CONFIRMED: 'bg-blue-500/10 text-blue-500',
  PRINTING: 'bg-indigo-500/10 text-indigo-500',
  QUALITY_CHECK: 'bg-orange-500/10 text-orange-500',
  READY_FOR_PICKUP: 'bg-teal-500/10 text-teal-500',
  SHIPPED: 'bg-purple-500/10 text-purple-500',
  OUT_FOR_DELIVERY: 'bg-cyan-500/10 text-cyan-500',
  DELIVERED: 'bg-emerald-500/10 text-emerald-500',
  CANCELLED: 'bg-destructive/10 text-destructive',
  REFUNDED: 'bg-rose-500/10 text-rose-500',
};

const STATUS_TABS = ['all', 'PENDING', 'PRINTING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function DesignerOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('all');

  React.useEffect(() => {
    designerApi.orders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o: any) => {
    if (tab !== 'all' && o.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !(o.orderNumber || '').toLowerCase().includes(q) &&
        !(o.customerName || '').toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          All customer orders that include your designs.
        </p>
      </div>

      <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters */}
        <CardHeader className="border-b border-border/40 bg-muted/20 py-3 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={tab} onValueChange={setTab} className="w-fit">
              <TabsList className="bg-muted/60 p-1 h-8 border border-border/40 flex-wrap">
                {STATUS_TABS.map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background capitalize"
                  >
                    {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 w-56 bg-background border-border/60 text-xs rounded-full"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
              <p className="text-sm">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-destructive">
              <AlertTriangle className="h-7 w-7 opacity-60" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="h-10 border-b border-border/40">
                  <TableHead className="font-bold text-xs pl-6">Order</TableHead>
                  <TableHead className="font-bold text-xs">Customer</TableHead>
                  <TableHead className="font-bold text-xs text-center">Designs Used</TableHead>
                  <TableHead className="font-bold text-xs">Amount</TableHead>
                  <TableHead className="font-bold text-xs">Date</TableHead>
                  <TableHead className="font-bold text-xs pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground text-sm">
                      <ShoppingBag className="mx-auto h-8 w-8 opacity-25 mb-2" />
                      {search ? 'No orders match your search.' : 'No orders with your designs yet.'}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((o: any) => (
                  <TableRow key={o.id} className="hover:bg-muted/10 transition-colors h-14">
                    <TableCell className="pl-6 font-mono font-bold text-xs text-primary">
                      #{o.orderNumber || o.id?.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">{o.customerName || '—'}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/10 text-orange-500 font-black text-xs">
                        {o.designCount}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-sm">रू {Number(o.total).toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(o.createdAt).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="outline"
                        className={`border-none font-bold text-[10px] px-2 h-5 rounded-full uppercase tracking-wide ${STATUS_STYLES[o.status] || 'bg-muted/40 text-muted-foreground'}`}
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {!loading && !error && orders.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>
            Showing <span className="font-bold text-foreground">{filtered.length}</span> of{' '}
            <span className="font-bold text-foreground">{orders.length}</span> orders
          </span>
        </div>
      )}
    </div>
  );
}
