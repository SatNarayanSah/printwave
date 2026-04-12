'use client';

import * as React from 'react';
import { CircleDollarSign, TrendingUp, Wallet, ArrowDownToLine, ReceiptText, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';

export default function FinancePage() {
  const [ordersList, setOrdersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminApi.orders()
      .then(res => setOrdersList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calculate Revenue
  const totalRevenue = ordersList
    .filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  
  const estimatedTax = totalRevenue * 0.13; // rough 13% tax mock

  const recentTransactions = ordersList
    .slice(0, 10)
    .filter(o => o.total && Number(o.total) > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Finance & Payments</h1>
          <p className="text-muted-foreground mt-1">Track revenue, manage designer payouts, and financial reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold gap-2 rounded-full">
            <ReceiptText className="h-4 w-4" />
            Tax Report
          </Button>
          <Button className="font-bold gap-2 rounded-full px-6 bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowDownToLine className="h-4 w-4" />
            Export P&L
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Total Revenue', value: `रू ${totalRevenue.toLocaleString()}`, change: 'Overall', icon: Wallet, color: 'text-emerald-500' },
          { title: 'Tax Estimated', value: `रू ${estimatedTax.toLocaleString()}`, change: '13% VAT', icon: PieChart, color: 'text-blue-500' },
          { title: 'Pending Payouts', value: 'रू 0', change: '0 Requests', icon: CircleDollarSign, color: 'text-amber-500' },
        ].map((item) => (
          <Card key={item.title} className="border-border/40 shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{loading ? '...' : item.value}</div>
              <p className="text-xs font-bold text-muted-foreground mt-1">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-lg font-bold">Designer Payout Requests</CardTitle>
                  <CardDescription>Approve or manage withdrawals.</CardDescription>
               </div>
               <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[10px]">PENDING</Badge>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border/40 bg-muted/10 text-center">
                     <p className="text-sm text-muted-foreground font-medium">No pending withdrawal requests from designers yet.</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-border/40 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
               <CardDescription>All incoming and outgoing flow.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader className="bg-muted/10">
                     <TableRow>
                        <TableHead className="font-bold pl-6 text-[10px] uppercase">Type</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase">Amount</TableHead>
                        <TableHead className="font-bold text-[10px] uppercase">Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {loading ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Loading transactions...</TableCell>
                        </TableRow>
                     ) : recentTransactions.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No recent transactions.</TableCell>
                        </TableRow>
                     ) : recentTransactions.map((order) => (
                       <TableRow key={order.id} className="hover:bg-muted/5 transition-colors">
                          <TableCell className="pl-6 py-3">
                            <div className="font-bold text-xs">Customer Purchase</div>
                            <div className="text-[10px] text-muted-foreground">Order #{order.orderNumber || order.id.substring(0,8).toUpperCase()}</div>
                          </TableCell>
                          <TableCell className="font-black text-xs text-emerald-500">+ रू {Number(order.total).toLocaleString()}</TableCell>
                          <TableCell>
                             <Badge variant="outline" className={`text-[10px] border-none font-bold ${order.status === 'CANCELLED' || order.paymentStatus === 'REFUNDED' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
                               {order.status === 'CANCELLED' || order.paymentStatus === 'REFUNDED' ? 'CANCELLED' : 'SUCCESS'}
                             </Badge>
                          </TableCell>
                       </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
