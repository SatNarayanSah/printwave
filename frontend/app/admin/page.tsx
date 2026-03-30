'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

interface Stats {
  totalRevenue: number | string;
  totalOrders: number;
  totalProducts: number;
  totalDesigns: number;
}

interface Order {
  id: string;
  orderNumber: string;
  user?: { firstName?: string; lastName?: string; email?: string };
  total: number | string;
  createdAt: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data?.stats);
        setRecentOrders(response.data?.recentOrders || []);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-divider rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-divider rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${parseFloat(stats?.totalRevenue || 0).toFixed(2)}`, accent: 'from-amber-400 to-amber-600' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, accent: 'from-main to-accent' },
    { label: 'Total Products', value: stats?.totalProducts || 0, accent: 'from-emerald-400 to-emerald-600' },
    { label: 'Total Designs', value: stats?.totalDesigns || 0, accent: 'from-blue-400 to-blue-600' },
  ];

  return (
    <div className="space-y-10 lg:space-y-12">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-main tracking-tight">Dashboard Overview</h1>
        <p className="text-muted text-sm font-medium mt-2">Metrics and recent platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl md:rounded-3xl p-6 lg:p-8 border border-divider/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-br ${card.accent} rounded-bl-[100px] opacity-[0.08] blur-2xl group-hover:scale-[1.2] transition-transform duration-700`} />
            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] relative z-10">{card.label}</span>
            <div className="text-3xl lg:text-[40px] font-black text-main tracking-tighter mt-4 lg:mt-6 relative z-10">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-divider/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 lg:px-8 border-b border-divider/60 bg-secondary-bg/30">
          <h2 className="text-xs font-black text-main uppercase tracking-[0.15em]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-4 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Order ID</th>
                <th className="px-6 py-4 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Customer</th>
                <th className="px-6 py-4 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Date</th>
                <th className="px-6 py-4 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Total</th>
                <th className="px-6 py-4 lg:px-8 font-bold text-muted uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/40 font-medium tracking-tight">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 lg:px-8 text-center text-muted text-sm">No orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-secondary-bg/40 transition-colors">
                    <td className="px-6 py-4 lg:px-8 font-black text-main">{order.orderNumber}</td>
                    <td className="px-6 py-4 lg:px-8 text-muted">{order.user?.email || 'N/A'}</td>
                    <td className="px-6 py-4 lg:px-8 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 lg:px-8 font-black text-main">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4 lg:px-8">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full border ${
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        'bg-[#f1f5f9] text-muted border-divider'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
