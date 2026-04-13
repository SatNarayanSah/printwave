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
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Order Feed</h1>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          Sales history of your custom artwork
        </p>
      </div>

      <Card className="border-border/40 bg-card/30 shadow-sm rounded-2xl overflow-hidden">
        {/* Filters */}
        <CardHeader className="border-b border-border/20 py-2.5 px-4 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={tab} onValueChange={setTab} className="w-fit">
              <TabsList className="bg-muted/40 p-0.5 h-7 border border-border/40 flex-wrap overflow-hidden">
                {STATUS_TABS.map((s) => (
                  <TabsTrigger
                    key={s}
                    value={s}
                    className="rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background"
                  >
                    {s === 'all' ? 'All' : s}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60" />
              <Input
                placeholder="Find orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-7 w-48 bg-background/50 border-border/40 text-[11px] font-medium rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
              <span className="text-[10px] font-black uppercase">Syncing Orders...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6 opacity-60" />
              <span className="text-[10px] font-black uppercase">{error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="h-9 border-b border-border/20">
                    <TableHead className="font-black text-[10px] uppercase pl-6">ID</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Client</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-center">Items</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Earning</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Date</TableHead>
                    <TableHead className="font-black text-[10px] uppercase pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-muted-foreground/40 font-black uppercase tracking-widest text-[11px]">
                        <ShoppingBag className="mx-auto h-8 w-8 opacity-10 mb-2" />
                        {search ? 'Zero Results' : 'No Sales Records'}
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((o: any) => (
                    <TableRow key={o.id} className="hover:bg-muted/20 transition-colors h-12 border-b border-border/10">
                      <TableCell className="pl-6 font-mono font-black text-[11px] text-primary">
                        #{o.orderNumber || o.id?.slice(0, 6).toUpperCase()}
                      </TableCell>
                      <TableCell className="font-bold text-xs truncate max-w-[120px]">{o.customerName || '—'}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-muted/60 text-muted-foreground font-black text-[10px]">
                          {o.designCount}
                        </span>
                      </TableCell>
                      <TableCell className="font-black text-xs tabular-nums text-foreground">रू {Number(o.total).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground/60 font-medium text-[10px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Badge
                          variant="outline"
                          className={`border-none font-black text-[9px] px-1.5 h-4.5 rounded-sm uppercase tracking-tighter ${STATUS_STYLES[o.status] || 'bg-muted/40 text-muted-foreground'}`}
                        >
                          {o.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Footer Line */}
      {!loading && !error && orders.length > 0 && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-1 opacity-70">
           Found {filtered.length} records in total
        </div>
      )}
    </div>

  );
}
