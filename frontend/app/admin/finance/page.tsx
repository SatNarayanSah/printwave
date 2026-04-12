'use client';

import * as React from 'react';
import { CircleDollarSign, TrendingUp, Wallet, ArrowDownToLine, ReceiptText, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FinancePage() {
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
          { title: 'Monthly Revenue', value: 'रू 245,800', change: '+18%', icon: Wallet, color: 'text-emerald-500' },
          { title: 'Tax Estimated', value: 'रू 32,450', change: 'Current Qtr', icon: PieChart, color: 'text-blue-500' },
          { title: 'Pending Payouts', value: 'रू 12,900', change: '5 Requests', icon: CircleDollarSign, color: 'text-amber-500' },
        ].map((item) => (
          <Card key={item.title} className="border-border/40 shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{item.value}</div>
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
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col p-4 rounded-xl border border-border/40 bg-muted/10">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <span className="font-bold text-sm">Bibek Design Studio</span>
                             <p className="text-[10px] text-muted-foreground font-bold">EARNED FROM 42 SALES</p>
                          </div>
                          <span className="font-black text-lg">रू 4,500</span>
                       </div>
                       <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider">Reject</Button>
                          <Button size="sm" className="flex-1 rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700">Approve & Pay</Button>
                       </div>
                    </div>
                  ))}
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
                     {[1, 2, 3, 4].map((i) => (
                       <TableRow key={i} className="hover:bg-muted/5 transition-colors">
                          <TableCell className="pl-6 py-3 font-bold text-xs">Customer Purchase</TableCell>
                          <TableCell className="font-black text-xs text-emerald-500">+ रू 1,299</TableCell>
                          <TableCell>
                             <Badge variant="outline" className="text-[10px] border-none bg-emerald-500/10 text-emerald-500 font-bold">SUCCESS</Badge>
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
