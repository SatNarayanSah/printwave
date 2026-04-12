'use client';

import * as React from 'react';
import {
  Megaphone, Tag, Gift, Mail, Plus, Trash2, ToggleLeft, ToggleRight, Loader2
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const BACKEND_COUPONS_URL = '/api/admin/coupons';

export default function MarketingPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loadingStats, setLoadingStats] = React.useState(true);

  // Coupon management state
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = React.useState(true);
  const [newCoupon, setNewCoupon] = React.useState({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    // Load revenue stats from dashboard
    adminApi.dashboard()
      .then(res => setOrders(res.data?.recentOrders || []))
      .catch(console.error)
      .finally(() => setLoadingStats(false));

    // Load coupons
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setLoadingCoupons(true);
    fetch(BACKEND_COUPONS_URL, { credentials: 'include' })
      .then(r => r.json())
      .then(res => setCoupons(res.data || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoadingCoupons(false));
  };

  const createCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountPercent) return;
    setCreating(true);
    try {
      const r = await fetch(BACKEND_COUPONS_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCoupon.code.toUpperCase(),
          type: 'PERCENTAGE',
          value: parseFloat(newCoupon.discountPercent),
          maxUses: newCoupon.maxUses ? parseInt(newCoupon.maxUses) : null,
          expiresAt: newCoupon.expiresAt || null,
          isActive: true,
        }),
      });
      await fetchCoupons();
      setNewCoupon({ code: '', discountPercent: '', maxUses: '', expiresAt: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const toggleCoupon = async (coupon: any) => {
    try {
      await fetch(`${BACKEND_COUPONS_URL}/${coupon.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      fetchCoupons();
    } catch (e) { console.error(e); }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await fetch(`${BACKEND_COUPONS_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchCoupons();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Marketing & Promotions</h1>
        <p className="text-muted-foreground mt-1">Manage discount codes, campaigns, and customer engagement.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Active Coupons', value: coupons.filter(c => c.isActive).length, icon: Tag, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Coupons', value: coupons.length, icon: Gift, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Total Campaigns', value: 0, icon: Megaphone, color: 'text-purple-500 bg-purple-500/10' },
        ].map(s => (
          <Card key={s.label} className="border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loadingCoupons ? '...' : s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Coupon */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Create New Coupon</CardTitle>
          <CardDescription>Add discount codes for promotions and campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Input
              placeholder="COUPON CODE"
              value={newCoupon.code}
              onChange={e => setNewCoupon(v => ({ ...v, code: e.target.value.toUpperCase() }))}
              className="font-mono font-bold uppercase"
            />
            <Input
              placeholder="Discount % (e.g. 15)"
              type="number"
              value={newCoupon.discountPercent}
              onChange={e => setNewCoupon(v => ({ ...v, discountPercent: e.target.value }))}
            />
            <Input
              placeholder="Max uses (optional)"
              type="number"
              value={newCoupon.maxUses}
              onChange={e => setNewCoupon(v => ({ ...v, maxUses: e.target.value }))}
            />
            <Input
              type="date"
              placeholder="Expires at (optional)"
              value={newCoupon.expiresAt}
              onChange={e => setNewCoupon(v => ({ ...v, expiresAt: e.target.value }))}
            />
          </div>
          <Button onClick={createCoupon} disabled={creating || !newCoupon.code || !newCoupon.discountPercent} className="gap-2 font-bold rounded-full px-6">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Coupon
          </Button>
        </CardContent>
      </Card>

      {/* Coupon List */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5" /> Active Discount Codes</CardTitle>
          <CardDescription>All coupon codes in the system.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="pl-6 font-bold">Code</TableHead>
                <TableHead className="font-bold">Discount</TableHead>
                <TableHead className="font-bold">Uses</TableHead>
                <TableHead className="font-bold">Expires</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCoupons ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin mb-1" />Loading...
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No coupons yet. Create one above!</TableCell>
                </TableRow>
              ) : coupons.map(c => (
                <TableRow key={c.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6 font-mono font-black text-primary">{c.code}</TableCell>
                  <TableCell className="font-bold">{c.type === 'PERCENTAGE' ? `${c.value}%` : `रू ${c.value}`}</TableCell>
                  <TableCell className="text-muted-foreground">{c.usedCount ?? 0} {c.maxUses ? `/ ${c.maxUses}` : ''}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] font-bold border-none ${c.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleCoupon(c)} title={c.isActive ? 'Deactivate' : 'Activate'}>
                        {c.isActive ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteCoupon(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Campaign placeholder */}
      <Card className="border-border/40 shadow-sm border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground"><Mail className="h-5 w-5" /> Email Campaigns</CardTitle>
          <CardDescription>Bulk email broadcasts to customer segments — coming in next release.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled className="gap-2 font-bold rounded-full">
            <Mail className="h-4 w-4" />
            New Campaign (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
