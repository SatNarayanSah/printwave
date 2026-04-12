'use client';

import * as React from 'react';
import { Truck, MapPin, PackageOpen, History, Settings2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/lib/api';

export default function ShippingControlPage() {
  const [ordersList, setOrdersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminApi.orders()
      .then(res => setOrdersList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const inTransitCount = ordersList.filter(o => o.status === 'SHIPPED').length;
  const recentShipments = ordersList
    .filter(o => ['SHIPPED', 'DELIVERED'].includes(o.status))
    .slice(0, 10); // get top 10

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Shipping Control</h1>
        <p className="text-muted-foreground mt-1">Manage delivery zones, rates, and tracking for Nepal and International shipping.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 shadow-sm border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Janakpur Local
            </CardTitle>
            <CardDescription>Bicycle and Bike delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Standard Rate</span>
              <span className="text-primary">रू 50.00</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Active Couriers</span>
              <span>12 Personnel</span>
            </div>
            <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-xs">Manage Zones</Button>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Nepal Wide
            </CardTitle>
            <CardDescription>Third party logistics & Nepal Post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Standard Rate</span>
              <span className="text-blue-500">रू 150.00</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Avg Delivery Time</span>
              <span>3-5 Days</span>
            </div>
             <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-xs">Configure Couriers</Button>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-purple-500" />
              In Transit
            </CardTitle>
            <CardDescription>Packages currently on the move</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="text-4xl font-black text-purple-500">{loading ? '...' : inTransitCount}</div>
             <p className="text-xs text-muted-foreground font-medium">Orders currently on their way.</p>
             <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-xs">Track All Shipments</Button>
          </CardContent>
        </Card>
      </div>

       <Card className="border-border/40 shadow-sm">
        <CardHeader>
           <CardTitle className="text-lg font-bold">Recent Shipping Activity</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading shipments...</div>
              ) : recentShipments.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent shipping activity.</div>
              ) : recentShipments.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border/60">
                         <Truck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-sm">#{order.orderNumber || order.id.substring(0,8).toUpperCase()} Shipped to {order.address?.city || 'Customer'}</span>
                         <span className="text-[10px] uppercase font-bold text-muted-foreground">
                            {new Date(order.updatedAt).toLocaleDateString()} at {new Date(order.updatedAt).toLocaleTimeString()}
                         </span>
                      </div>
                   </div>
                   <Badge className={`border-none font-bold text-[10px] ${order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {order.status}
                   </Badge>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
