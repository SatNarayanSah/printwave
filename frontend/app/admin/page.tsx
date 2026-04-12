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
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4500, orders: 120 },
  { name: 'Feb', revenue: 3200, orders: 98 },
  { name: 'Mar', revenue: 6800, orders: 156 },
  { name: 'Apr', revenue: 5400, orders: 135 },
  { name: 'May', revenue: 8900, orders: 210 },
  { name: 'Jun', revenue: 7600, orders: 185 },
];

const RECENT_ORDERS = [
  { id: '#PW-1024', customer: 'Ayush Shah', date: '2 mins ago', amount: 'रू 2,499', status: 'Pending', design: 'Mithila Tree of Life' },
  { id: '#PW-1023', customer: 'Bikash Mahato', date: '15 mins ago', amount: 'रू 1,250', status: 'Processing', design: 'Janakpur Temple Print' },
  { id: '#PW-1022', customer: 'Sneha Yadav', date: '1 hour ago', amount: 'रू 4,800', status: 'Shipped', design: 'Custom Couple Hoodie' },
  { id: '#PW-1021', customer: 'Ram Kumar', date: '3 hours ago', amount: 'रू 950', status: 'Delivered', design: 'Minimalist Pokhara' },
  { id: '#PW-1020', customer: 'Sita Kumari', date: '5 hours ago', amount: 'रू 2,100', status: 'Delivered', design: 'Madhubani Art T-shirt' },
];

const STAT_CARDS = [
  { 
    title: 'Total Revenue', 
    value: 'रू 128,450', 
    change: '+12.5%', 
    trend: 'up', 
    icon: ShoppingCart,
    color: 'bg-blue-500/10 text-blue-500'
  },
  { 
    title: 'Active Orders', 
    value: '42', 
    change: '+8 this week', 
    trend: 'up', 
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-500'
  },
  { 
    title: 'New Customers', 
    value: '156', 
    change: '+18% from last month', 
    trend: 'up', 
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  { 
    title: 'Design Approval', 
    value: '12', 
    change: 'Pending review', 
    trend: 'neutral', 
    icon: Palette,
    color: 'bg-purple-500/10 text-purple-500'
  },
];

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminApi.dashboard()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const statCardsData = [
    { 
      title: 'Total Revenue', 
      value: `रू ${Number(data?.stats?.totalRevenue || 0).toLocaleString()}`, 
      change: 'Lifetime Volume', 
      trend: 'up', 
      icon: ShoppingCart,
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      title: 'Total Orders', 
      value: data?.stats?.totalOrders || 0, 
      change: 'Total Purchases', 
      trend: 'none', 
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500'
    },
    { 
      title: 'Total Customers', 
      value: data?.stats?.totalUsers || 0, 
      change: 'Registered Users', 
      trend: 'none', 
      icon: Users,
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    { 
      title: 'Total Designs', 
      value: data?.stats?.totalDesigns || 0, 
      change: 'Uploaded Artworks', 
      trend: 'none', 
      icon: Palette,
      color: 'bg-purple-500/10 text-purple-500'
    },
  ];

  const recentOrdersRender = (data?.recentOrders || []).map((order: any) => ({
    id: `#PW-${order.orderNumber || order.id.substring(0, 6).toUpperCase()}`,
    customer: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest',
    date: new Date(order.createdAt).toLocaleDateString(),
    amount: `रू ${Number(order.total).toLocaleString()}`,
    status: order.status,
    design: 'Custom Print'
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of Persomith business health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCardsData.map((stat) => (
          <Card key={stat.title} className="border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-destructive' : 'text-amber-500'}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-muted-foreground ml-0.5">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Revenue Dynamics</CardTitle>
                <CardDescription>Monthly growth and order volume analysis.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">Last 6 Months</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
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
                    tickFormatter={(value) => `रू${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Designs</CardTitle>
            <CardDescription>Most popular Mithila art prints this month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: 'Mithila Mandala', sales: 124, progress: 85, color: 'bg-primary' },
              { name: 'Janakpur Temple', sales: 98, progress: 65, color: 'bg-emerald-500' },
              { name: 'Tree of Life', sales: 76, progress: 50, color: 'bg-amber-500' },
              { name: 'Traditional Fish', sales: 64, progress: 40, color: 'bg-blue-500' },
              { name: 'Festival Vibes', sales: 42, progress: 30, color: 'bg-purple-500' },
            ].map((design) => (
              <div key={design.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{design.name}</span>
                  <span className="text-muted-foreground font-medium">{design.sales} sales</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${design.color}`} 
                    style={{ width: `${design.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription>View and manage the latest customer requests.</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All Orders</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Design Name</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrdersRender.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No recent orders found.
                  </TableCell>
                </TableRow>
              ) : recentOrdersRender.map((order: any) => (
                <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono font-medium text-xs tracking-tighter">{order.id}</TableCell>
                  <TableCell className="font-semibold">{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground text-sm italic">"{order.design}"</TableCell>
                  <TableCell className="font-bold">{order.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        border-none font-bold text-[10px] uppercase tracking-wider
                        ${['PENDING', 'Pending'].includes(order.status) ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${['PROCESSING', 'Processing'].includes(order.status) ? 'bg-blue-500/10 text-blue-500' : ''}
                        ${['SHIPPED', 'Shipped'].includes(order.status) ? 'bg-purple-500/10 text-purple-500' : ''}
                        ${['DELIVERED', 'Delivered'].includes(order.status) ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${['CANCELLED', 'Cancelled'].includes(order.status) ? 'bg-destructive/10 text-destructive' : ''}
                      `}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 font-bold text-xs hover:bg-primary/10 hover:text-primary">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
