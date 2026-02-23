'use client';
import { useEffect, useState } from 'react';
import { FiEye, FiArrowLeft } from 'react-icons/fi';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import { format } from 'date-fns';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedCustomer(null)}
            className="flex items-center gap-2 text-brand-primary hover:text-brand-dark font-medium">
            <FiArrowLeft size={18} /> Back to Customers
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
              {selectedCustomer.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-gray-800">{selectedCustomer.name}</h2>
              <p className="text-gray-500">{selectedCustomer.email}</p>
              <p className="text-gray-500 text-sm">📞 {selectedCustomer.phone || 'N/A'}</p>
            </div>
            <div className="ml-auto text-right">
              <span className={`badge ${selectedCustomer.isActive ? 'badge-delivered' : 'badge-cancelled'}`}>
                {selectedCustomer.isActive ? 'Active' : 'Inactive'}
              </span>
              <p className="text-sm text-gray-400 mt-2">Joined {format(new Date(selectedCustomer.createdAt), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {selectedCustomer.address && (
            <div className="bg-brand-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
              <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">
            Order History ({selectedCustomer.orders.length} orders)
          </h3>
          {selectedCustomer.orders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-4 py-3 font-semibold">Order ID</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedCustomer.orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3 font-bold text-gray-800">₹{order.totalAmount}</td>
                      <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(order.createdAt), 'dd MMM yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Customers</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Total Spent</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : customers.map((c) => {
                const totalSpent = c.orders.filter((o: any) => o.status !== 'CANCELLED').reduce((s: number, o: any) => s + o.totalAmount, 0);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                          {c.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{format(new Date(c.createdAt), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-4 font-semibold text-gray-800">{c.orders.length}</td>
                    <td className="px-4 py-4 font-bold text-brand-dark">₹{totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4">
                      <span className={`badge ${c.isActive ? 'badge-delivered' : 'badge-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => setSelectedCustomer(c)}
                        className="flex items-center gap-1.5 text-brand-primary hover:text-brand-dark font-medium text-xs border border-brand-light rounded-lg px-2.5 py-1.5 hover:bg-brand-50 transition-colors">
                        <FiEye size={13} /> View Orders
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
