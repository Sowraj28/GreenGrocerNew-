'use client';
import { useEffect, useState } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { format } from 'date-fns';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); });
  }, []);

  const cards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: FiShoppingBag, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: 'bg-brand-primary', light: 'bg-green-50', text: 'text-green-600' },
    { label: 'Customers', value: stats.totalCustomers, icon: FiUsers, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-7 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400">{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <div className={`w-12 h-12 ${card.light} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon size={24} className={card.text} />
            </div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiTrendingUp className="text-brand-primary" /> Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-sm text-brand-primary hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 font-medium text-gray-800">{order.user?.name}</td>
                  <td className="py-3 font-semibold text-gray-800">₹{order.totalAmount}</td>
                  <td className="py-3"><OrderStatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
