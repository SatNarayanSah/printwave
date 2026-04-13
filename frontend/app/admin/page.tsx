'use client';

import * as React from 'react';
import {
  Users,
  Package,
  Palette,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Loader2,
  BarChart3
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    adminApi.dashboard()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
        setError('Failed to load dashboard. Please check the server.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 text-destructive">
        <BarChart3 className="h-10 w-10 opacity-50" />
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const monthlyRevenue: { name: string; revenue: number; orders: number }[] = data?.monthlyRevenue || [];
  const topProducts: { name: string; sales: number }[] = data?.topProducts || [];
  const recentOrders: any[] = data?.recentOrders || [];

  const maxSales = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.sales)) : 1;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `रू ${Number(stats.totalRevenue || 0).toLocaleString()}`,
      change: 'All time (excl. cancelled)',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders ?? 0,
      change: 'All time purchases',
      trend: 'neutral',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers ?? 0,
      change: 'Customers & Designers',
      trend: 'up',
      icon: Users,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Design Approvals',
      value: stats.pendingDesigns ?? 0,
      change: 'Pending review',
      trend: stats.pendingDesigns > 0 ? 'down' : 'neutral',
      icon: Palette,
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  const COLORS = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Persomith business health.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : stat.trend === 'down' ? (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500'
                    : stat.trend === 'down' ? 'text-destructive'
                      : 'text-amber-500'
                  }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart + Top Products */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Revenue Dynamics</CardTitle>
                <CardDescription>Monthly revenue & order volume (last 12 months).</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">Last 12 Months</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-10 w-10 opacity-30 mb-2" />
                  No revenue data yet. Orders will appear once placed.
                </div>
              </div>
            ) : (
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(v) => `रू${Number(v).toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: any) => [`रू ${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Products</CardTitle>
            <CardDescription>Best selling products by units sold.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm">
                <Package className="h-10 w-10 opacity-30 mb-2" />
                No product sales data yet.
              </div>
            ) : topProducts.map((product, idx) => (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold truncate pr-2" title={product.name}>{product.name}</span>
                  <span className="text-muted-foreground font-medium flex-shrink-0">{product.sales} sold</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${COLORS[idx % COLORS.length]}`}
                    style={{ width: `${Math.round((product.sales / maxSales) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription>Latest customer purchases from the platform.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/orders'}>
            View All Orders
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Items</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : recentOrders.map((order: any) => {
                const customerName = order.user
                  ? `${order.user.firstName} ${order.user.lastName}`
                  : 'Guest';
                const totalItems = order.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0;
                const productNames = order.items
                  ?.map((i: any) => i.product?.name)
                  .filter(Boolean)
                  .join(', ') || 'Custom Print';

                return (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono font-bold text-xs text-primary">
                      #{order.orderNumber || order.id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-semibold">{customerName}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground italic truncate max-w-[150px] block" title={productNames}>
                        {totalItems} item{totalItems !== 1 ? 's' : ''}{productNames ? ` — ${productNames}` : ''}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold">रू {Number(order.total).toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          border-none font-bold text-[10px] uppercase tracking-wider
                          ${order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : ''}
                          ${order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${order.status === 'PRINTING' ? 'bg-indigo-500/10 text-indigo-500' : ''}
                          ${order.status === 'QUALITY_CHECK' ? 'bg-orange-500/10 text-orange-500' : ''}
                          ${order.status === 'READY_FOR_PICKUP' ? 'bg-teal-500/10 text-teal-500' : ''}
                          ${order.status === 'SHIPPED' ? 'bg-purple-500/10 text-purple-500' : ''}
                          ${order.status === 'OUT_FOR_DELIVERY' ? 'bg-cyan-500/10 text-cyan-500' : ''}
                          ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                          ${order.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' : ''}
                          ${order.status === 'REFUNDED' ? 'bg-rose-500/10 text-rose-500' : ''}
                        `}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-bold text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={() => window.location.href = '/admin/orders'}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
