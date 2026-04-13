'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ArrowUpRight,
  Loader2,
  ImageIcon,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { designerApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  CONFIRMED: 'bg-blue-500/10 text-blue-500',
  PRINTING: 'bg-indigo-500/10 text-indigo-500',
  QUALITY_CHECK: 'bg-orange-500/10 text-orange-500',
  SHIPPED: 'bg-purple-500/10 text-purple-500',
  DELIVERED: 'bg-emerald-500/10 text-emerald-500',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export default function DesignerDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    designerApi.dashboard()
      .then((res: any) => setData(res.data))
      .catch(() => setError('Failed to load dashboard. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        <p className="font-medium text-sm">Loading your studio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-destructive">
        <AlertTriangle className="h-10 w-10 opacity-60" />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentDesigns: any[] = data?.recentDesigns || [];
  const recentOrders: any[] = data?.recentOrders || [];

  const statCards = [
    {
      title: 'Total Designs',
      value: stats.totalDesigns ?? 0,
      sub: 'All uploaded artwork',
      icon: Palette,
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      title: 'Approved',
      value: stats.approvedDesigns ?? 0,
      sub: 'Live & approved by admin',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Pending Review',
      value: stats.pendingDesigns ?? 0,
      sub: 'Awaiting admin approval',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: 'Orders',
      value: stats.ordersCount ?? 0,
      sub: 'Orders using your designs',
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-500',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Studio Overview</h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Real-time performance & activity
          </p>
        </div>
        <Link href="/designer/designs">
          <Button size="sm" className="gap-2 rounded-xl font-bold px-4 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 border-0">
            <Upload className="h-3.5 w-3.5" />
            New Design
          </Button>
        </Link>
      </div>

      {/* Stats - Compact Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} className="border-border/40 bg-card/40 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{s.title}</span>
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${s.color.split(' ')[0]} bg-opacity-10`}>
                <s.icon className={`h-3 w-3 ${s.color.split(' ')[1]}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="text-xl font-black tabular-nums">{s.value}</div>
              <p className="text-[9px] text-muted-foreground/60 font-bold truncate mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content - Tighter Layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Recent Designs */}
        <Card className="lg:col-span-7 border-border/40 bg-card/30 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-border/20">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">Recent Studio Work</CardTitle>
            </div>
            <Link href="/designer/designs">
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest gap-1 hover:bg-muted/50 rounded-full">
                All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {recentDesigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40 text-[11px] font-bold uppercase tracking-widest gap-2">
                <ImageIcon className="h-8 w-8 opacity-20" />
                <span>Empty Studio</span>
              </div>
            ) : recentDesigns.map((d: any) => (
              <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 transition-all group">
                <div className="h-9 w-9 rounded-lg bg-muted/50 overflow-hidden flex items-center justify-center flex-shrink-0 border border-border/40 group-hover:border-primary/30 transition-colors">
                  {d.fileUrl ? (
                    <img src={d.thumbnailUrl || d.fileUrl} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate leading-none mb-1">{d.name || 'Untitled'}</p>
                  <p className="text-[10px] text-muted-foreground/70 font-medium">{d.fileSizeKb} KB · {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[9px] font-black uppercase tracking-tighter border-none px-2 h-5 rounded-md flex-shrink-0 ${d.isApproved ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}
                >
                  {d.isApproved ? 'Live' : 'Review'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-5 border-border/40 bg-card/30 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-border/20">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">Latest Earnings</CardTitle>
            </div>
            <Link href="/designer/orders">
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest gap-1 hover:bg-muted/50 rounded-full">
                 More <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40 text-[11px] font-bold uppercase tracking-widest gap-2">
                <ShoppingBag className="h-8 w-8 opacity-20" />
                <span>No Sales Yet</span>
              </div>
            ) : recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-muted/40 transition-all">
                <div className="flex flex-col">
                  <span className="font-mono font-black text-[10px] text-primary">#{o.orderNumber || o.id?.slice(0, 6).toUpperCase()}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{o.designCount} Artwork{o.designCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-black text-xs tabular-nums text-foreground">रू {Number(o.total).toLocaleString()}</span>
                  <Badge variant="outline" className={`mt-0.5 text-[8px] font-black px-1.5 h-4 border-none rounded-sm uppercase tracking-tighter ${ORDER_STATUS_STYLES[o.status] || 'bg-muted text-muted-foreground'}`}>
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compact Alert Notification */}
      {stats.pendingDesigns > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="flex items-center gap-3 py-3 px-5">
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-[11px] font-bold text-amber-700/80 leading-tight">
              {stats.pendingDesigns} design{stats.pendingDesigns !== 1 ? 's' : ''} in review. 
              <span className="font-medium text-muted-foreground ml-1">Approved artwork will be listed automatically.</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
