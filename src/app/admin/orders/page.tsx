'use client';
import { useEffect, useState } from 'react';
import { FiFileText, FiRefreshCw } from 'react-icons/fi';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import InvoiceModal from '@/components/admin/InvoiceModal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statuses = ['PLACED', 'PACKING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: updated.status });
      toast.success('Order status updated');
    }
  };

  const handleItemCheck = async (itemId: string, checked: boolean) => {
    const res = await fetch(`/api/orders/${selectedOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, checked }),
    });
    if (res.ok) {
      setSelectedOrder({
        ...selectedOrder,
        items: selectedOrder.items.map((i: any) => i.id === itemId ? { ...i, checked } : i),
      });
    }
  };

  const openInvoice = async (order: any) => {
    const res = await fetch(`/api/orders/${order.id}`);
    const full = await res.json();
    setSelectedOrder(full);
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Orders</h1>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-brand-primary hover:text-brand-dark text-sm font-medium">
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilter('')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!filter ? 'bg-brand-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50'}`}>
          All ({orders.length})
        </button>
        {statuses.map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === s ? 'bg-brand-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50'}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Change Status</th>
                <th className="px-4 py-3 font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{order.user?.name}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-4 font-bold text-gray-800">₹{order.totalAmount}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{format(new Date(order.createdAt), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-4 py-4">
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                        >
                          {statuses.filter(s => s !== 'CANCELLED').map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openInvoice(order)}
                        className="flex items-center gap-1.5 text-brand-primary hover:text-brand-dark font-medium text-xs border border-brand-light rounded-lg px-2.5 py-1.5 hover:bg-brand-50 transition-colors"
                      >
                        <FiFileText size={13} /> Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onItemCheck={handleItemCheck}
        />
      )}
    </div>
  );
}
