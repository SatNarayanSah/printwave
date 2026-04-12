'use client';

import * as React from 'react';
import { Printer, Settings, Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/lib/api';

export default function ProductionPage() {
  const [ordersList, setOrdersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  const qualityCheckQueue = ordersList.filter(o => o.status === 'QUALITY_CHECK');
  
  // count items printed today (using orders shipped or ready)
  let todayPrintedItems = 0;
  const today = new Date().toDateString();
  ordersList.forEach(o => {
    if (['QUALITY_CHECK', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED'].includes(o.status)) {
       const uDate = new Date(o.updatedAt).toDateString();
       if (uDate === today) {
          todayPrintedItems += o.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
       }
    }
  });

  const dailyTarget = 50;
  const targetPerc = Math.min(100, Math.round((todayPrintedItems / dailyTarget) * 100));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Printing & Production</h1>
        <p className="text-muted-foreground mt-1">Monitor real-time printing status and machine health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'DTG Printer #1', status: 'Printing', job: 'PW-1022', progress: 65, type: 'Direct to Garment' },
          { name: 'Plotter #A', status: 'Idle', job: 'None', progress: 0, type: 'Vinyl Cutting' },
          { name: 'Heat Press #4', status: 'Maintenance', job: 'None', progress: 0, type: 'Curing/Transfer' },
        ].map((machine) => (
          <Card key={machine.name} className="border-border/40 shadow-sm group">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  {machine.name}
                </CardTitle>
                <Badge variant="outline" className={`
                   font-bold border-none text-[10px] uppercase
                   ${machine.status === 'Printing' ? 'bg-emerald-500 text-white' : ''}
                   ${machine.status === 'Idle' ? 'bg-blue-500 text-white' : ''}
                   ${machine.status === 'Maintenance' ? 'bg-destructive text-white' : ''}
                `}>
                  {machine.status}
                </Badge>
              </div>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">{machine.type}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
               {machine.status === 'Printing' ? (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span>Job ID: <span className="text-primary font-mono">{machine.job}</span></span>
                       <span>{machine.progress}%</span>
                    </div>
                    <Progress value={machine.progress} className="h-2 rounded-full" />
                 </div>
               ) : (
                 <div className="h-10 flex items-center justify-center text-xs font-bold text-muted-foreground italic bg-muted/30 rounded-lg">
                    {machine.status === 'Idle' ? 'Ready for next job' : 'Offline for repairs'}
                 </div>
               )}
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5">
                     <Settings className="h-4 w-4" />
                     Settings
                  </Button>
                  {machine.status === 'Printing' ? (
                     <Button variant="destructive" size="sm" className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5">
                        <Pause className="h-4 w-4" />
                        Pause
                     </Button>
                  ) : (
                     <Button className="flex-1 rounded-lg h-9 font-bold text-xs gap-1.5" disabled={machine.status === 'Maintenance'}>
                        <Play className="h-4 w-4" />
                        Start Job
                     </Button>
                  )}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-border/40 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Quality Check Queue
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  {loading ? (
                    <div className="text-sm text-muted-foreground">Loading queue...</div>
                  ) : qualityCheckQueue.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-3 bg-muted/10 rounded-xl border border-border/40">Queue is empty.</div>
                  ) : qualityCheckQueue.map((order) => {
                    const totalItems = order.items?.reduce((a: number, c: any) => a + c.quantity, 0) || 0;
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10">
                         <span className="font-bold text-sm">#{order.orderNumber || order.id.substring(0,8).toUpperCase()} ({totalItems} Items)</span>
                         <div className="flex gap-2">
                           <Button 
                             onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')}
                             size="sm" 
                             className="h-7 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                           >
                             Pass
                           </Button>
                           <Button 
                             onClick={() => updateStatus(order.id, 'PRINTING')}
                             size="sm" 
                             variant="outline" 
                             className="h-7 text-[10px] font-black uppercase tracking-wider rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                           >
                             Reject (Reprint)
                           </Button>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </CardContent>
         </Card>
         <Card className="border-border/40 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Daily Production Yield
               </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-1 mb-2">
                   <div className="text-4xl font-black">{todayPrintedItems}</div>
                   <div className="text-xs text-muted-foreground font-bold mb-1">/ {dailyTarget} Target Items</div>
                </div>
                <Progress value={targetPerc} className="h-3 rounded-full bg-muted" />
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
