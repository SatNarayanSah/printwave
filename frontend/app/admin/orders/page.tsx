'use client';

import * as React from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Truck,
  PackageCheck,
  MoreHorizontal,
  ChevronRight,
  MapPin,
  CalendarDays,
  Loader2,
  PackageX
} from 'lucide-react';
import { adminApi } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OrderManagementPage() {
  const [ordersList, setOrdersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    adminApi.orders()
      .then(res => setOrdersList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, { status });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'City', 'Items', 'Total (रू)', 'Status', 'Date'],
      ...filteredOrders.map(o => [
        `#${o.orderNumber || o.id.substring(0, 8).toUpperCase()}`,
        o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest',
        o.address?.city || 'N/A',
        o.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0,
        Number(o.total).toFixed(2),
        o.status,
        new Date(o.createdAt).toLocaleDateString(),
      ])
    ];
    const csv = rows.map(r => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = ordersList.filter(order => {
    if (filterStatus !== 'All' && order.status !== filterStatus.toUpperCase() && order.status !== filterStatus) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (
        !order.orderNumber?.toString().toLowerCase().includes(q) &&
        !order.id.toLowerCase().includes(q) &&
        !(order.user?.firstName + ' ' + order.user?.lastName).toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const getStatusCount = (status: string) => {
    return ordersList.filter(o => o.status === status).length;
  };

  const stats = [
    { label: 'Pending', count: getStatusCount('PENDING'), color: 'bg-amber-500' },
    { label: 'Processing', count: getStatusCount('PROCESSING'), color: 'bg-blue-500' },
    { label: 'Shipped', count: getStatusCount('SHIPPED'), color: 'bg-indigo-500' },
    { label: 'Delivered', count: getStatusCount('DELIVERED'), color: 'bg-emerald-500' },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage customer orders across all stages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2 rounded-full" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button className="font-bold gap-2 rounded-full px-6">
            <PackageCheck className="h-4 w-4" />
            Bulk Process
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="border-border/40 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.color}`} />
            <CardHeader className="py-4">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">{item.label} Orders</CardDescription>
              <CardTitle className="text-3xl font-black">{item.count}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-background rounded-full border border-border/60">
                {['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status, i) => (
                  <Button 
                    key={status}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilterStatus(status)}
                    className={`h-7 text-[10px] font-bold rounded-full px-3 ${filterStatus === status ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm' : ''}`}
                  >
                    {status}
                  </Button>
                ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-64 bg-background border-border/60" 
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="font-bold pl-6">Order ID</TableHead>
                <TableHead className="font-bold">Customer Info</TableHead>
                <TableHead className="font-bold">Order Details</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <PackageX className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : filteredOrders.map((order) => {
                const totalItemCount = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest';
                const location = order.address ? order.address.city : 'N/A';
                
                return (
                  <TableRow key={order.id} className="hover:bg-muted/10 transition-colors group">
                    <TableCell className="pl-6">
                      <span className="font-mono font-black text-primary text-sm">#{order.orderNumber || order.id.substring(0,8).toUpperCase()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-[150px]" title={customerName}>{customerName}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{location.toUpperCase()}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{totalItemCount} Items • App</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase">
                          <CalendarDays className="h-3 w-3 text-primary/60" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-sm">रू {Number(order.total).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`
                          font-bold text-[10px] uppercase tracking-wider border-none rounded-full px-3
                          ${['PENDING', 'Pending'].includes(order.status) ? 'bg-amber-500/10 text-amber-500' : ''}
                          ${['PROCESSING', 'Confirmed'].includes(order.status) ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${['SHIPPED', 'Shipped'].includes(order.status) ? 'bg-indigo-500/10 text-indigo-500' : ''}
                          ${['DELIVERED', 'Delivered'].includes(order.status) ? 'bg-emerald-500/10 text-emerald-500' : ''}
                          ${['CANCELLED', 'Cancelled'].includes(order.status) ? 'bg-destructive/10 text-destructive' : ''}
                        `}
                        variant="outline"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" className="h-8 font-bold text-[10px] uppercase gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/20 rounded-lg">
                          <Printer className="h-3 w-3" />
                          Label
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" className="h-8 font-bold text-[10px] uppercase gap-1 rounded-lg">
                              Process
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl font-medium">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, 'PROCESSING')}>Mark as Processing</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, 'SHIPPED')}>Mark as Shipped</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, 'DELIVERED')} className="text-emerald-500">Mark as Delivered</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateStatus(order.id, 'CANCELLED')} className="text-destructive focus:bg-destructive/10 text-xs">Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-border/40 shadow-sm border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Shipping Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have <strong>{getStatusCount('READY_FOR_PICKUP')}</strong> orders ready for pickup and <strong>{getStatusCount('SHIPPED')}</strong> currently in transit.
              </p>
              <Button variant="outline" className="w-full font-bold text-xs uppercase tracking-wide rounded-xl" onClick={() => window.location.href = '/admin/shipping'}>View Shipping Control</Button>
            </CardContent>
         </Card>
         <Card className="border-border/40 shadow-sm border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Printer className="h-5 w-5 text-purple-500" />
                Production Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>{getStatusCount('PRINTING')}</strong> orders currently printing. <strong>{getStatusCount('QUALITY_CHECK')}</strong> awaiting quality inspection.
              </p>
              <Button variant="outline" className="w-full font-bold text-xs uppercase tracking-wide rounded-xl" onClick={() => window.location.href = '/admin/production'}>View Production Queue</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
