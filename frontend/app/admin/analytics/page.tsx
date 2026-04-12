'use client';

import * as React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

export default function AnalyticsPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminApi.dashboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const monthlyRevenue = data?.monthlyRevenue || [];
  const topProducts = data?.topProducts || [];
  const stats = data?.stats || {};
  const statusBreakdown: { status: string; count: string }[] = data?.statusBreakdown || [];

  const maxSales = topProducts.length > 0 ? Math.max(...topProducts.map((p: any) => p.sales)) : 1;

  const pieData = statusBreakdown.map(s => ({
    name: s.status,
    value: parseInt(s.count),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Data-driven insights to grow Persomith.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `रू ${Number(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Orders', value: stats.totalOrders ?? 0, icon: ShoppingCart, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Total Products', value: stats.totalProducts ?? 0, icon: Package, color: 'text-purple-500 bg-purple-500/10' },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Over Time */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No revenue data yet.</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `रू${Number(v).toLocaleString()}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(v: any) => [`रू ${Number(v).toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Order Statuses</CardTitle>
            <CardDescription>Distribution by current status</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No orders yet.</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Orders Bar + Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Monthly Orders</CardTitle>
            <CardDescription>Order volume by month</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet.</div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Products</CardTitle>
            <CardDescription>Best performers by units sold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {topProducts.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No sales data yet.</div>
            ) : topProducts.map((p: any, idx: number) => (
              <div key={p.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold truncate pr-2" title={p.name}>{p.name}</span>
                  <span className="text-muted-foreground font-medium flex-shrink-0 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    {p.sales} sold
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 rounded-full"
                    style={{ width: `${Math.round((p.sales / maxSales) * 100)}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
