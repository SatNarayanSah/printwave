'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

const STATUS_OPTIONS = [
  'PENDING', 'CONFIRMED', 'PRINTING', 'QUALITY_CHECK', 
  'READY_FOR_PICKUP', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 
  'CANCELLED', 'REFUNDED'
];

interface Order {
  id: string;
  orderNumber: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  total: number | string;
  createdAt: string;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) return <div className="animate-pulse h-10 bg-divider rounded w-1/4"></div>;

  return (
    <div className="space-y-8 lg:space-y-12">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-main tracking-tight">Order Management</h1>
        <p className="text-muted text-sm font-medium mt-2">Track and update customer orders</p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-divider/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f8fafc] border-b border-divider/60">
            <tr>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Order ID</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Customer</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Amount</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Date</th>
              <th className="px-6 py-5 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider/40 font-medium tracking-tight">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-secondary-bg/40 transition-colors">
                <td className="px-6 py-4 lg:px-8 font-black text-main">
                  {o.orderNumber}
                </td>
                <td className="px-6 py-4 lg:px-8">
                  <span className="block font-black text-main">{o.user?.firstName} {o.user?.lastName}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted mt-0.5">{o.user?.email}</span>
                </td>
                <td className="px-6 py-4 lg:px-8 font-black text-main">${Number(o.total).toFixed(2)}</td>
                <td className="px-6 py-4 lg:px-8 text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 lg:px-8">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border outline-none cursor-pointer appearance-none ${
                        o.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        'bg-[#f1f5f9] text-muted border-divider/60'
                    }`}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 lg:py-16 text-muted text-sm font-medium">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
