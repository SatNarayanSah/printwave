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
  CalendarDays
} from 'lucide-react';

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

const MOCK_ORDERS = [
  { id: 'PW-1024', customer: 'Ayush Shah', date: 'Apr 12, 10:45 AM', items: 3, total: 'रू 2,499', status: 'Pending', method: 'eSewa', location: 'Janakpur' },
  { id: 'PW-1023', customer: 'Bikash Mahato', date: 'Apr 12, 09:15 AM', items: 1, total: 'रू 1,250', status: 'Confirmed', method: 'Khalti', location: 'Kathmandu' },
  { id: 'PW-1022', customer: 'Sneha Yadav', date: 'Apr 11, 04:30 PM', items: 5, total: 'रू 4,800', status: 'Printing', method: 'COD', location: 'Pokhara' },
  { id: 'PW-1021', customer: 'Ram Kumar', date: 'Apr 11, 11:20 AM', items: 2, total: 'रू 1,850', status: 'Shipped', method: 'Bank Transfer', location: 'Janakpur' },
  { id: 'PW-1020', customer: 'Sita Kumari', date: 'Apr 10, 02:15 PM', items: 1, total: 'रू 950', status: 'Delivered', method: 'eSewa', location: 'Biratnagar' },
];

export default function OrderManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Order Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage customer orders across all stages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2 rounded-full">
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
        {[
          { label: 'New', count: '12', color: 'bg-amber-500' },
          { label: 'Active', count: '28', color: 'bg-blue-500' },
          { label: 'Shipping', count: '08', color: 'bg-purple-500' },
          { label: 'Completed', count: '142', color: 'bg-emerald-500' },
        ].map((item) => (
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
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status, i) => (
                  <Button 
                    key={status}
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 text-[10px] font-bold rounded-full px-3 ${i === 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm' : ''}`}
                  >
                    {status}
                  </Button>
                ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-9 h-9 w-64 bg-background border-border/60" />
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
              {MOCK_ORDERS.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/10 transition-colors group">
                  <TableCell className="pl-6">
                    <span className="font-mono font-black text-primary text-sm">#{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{order.customer}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                        <MapPin className="h-3 w-3" />
                        {order.location.toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{order.items} Items • {order.method}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase">
                        <CalendarDays className="h-3 w-3 text-primary/60" />
                        {order.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-sm">{order.total}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        font-bold text-[10px] uppercase tracking-wider border-none rounded-full px-3
                        ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : ''}
                        ${order.status === 'Printing' ? 'bg-purple-500/10 text-purple-500' : ''}
                        ${order.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-500' : ''}
                        ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : ''}
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
                      <Button size="sm" className="h-8 font-bold text-[10px] uppercase gap-1 rounded-lg">
                        Process
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              <p className="text-sm text-muted-foreground mb-4">You have 5 orders ready for local delivery in Janakpur.</p>
              <Button variant="outline" className="w-full font-bold text-xs uppercase tracking-wide rounded-xl">Generate Delivery Run Sheet</Button>
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
              <p className="text-sm text-muted-foreground mb-4">3 New custom designs confirmed and ready for printing machines.</p>
              <Button variant="outline" className="w-full font-bold text-xs uppercase tracking-wide rounded-xl">View Production Queue</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
