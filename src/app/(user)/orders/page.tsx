'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import OrderTracker from '@/components/shared/OrderTracker';
import { FiPackage, FiChevronDown, FiChevronUp, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  }, [session]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Cancel this order?')) return;
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel: true }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders(orders.map(o => o.id === orderId ? updated : o));
      toast.success('Order cancelled');
    } else {
      toast.error('Cannot cancel this order');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6 mb-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <div className="text-7xl mb-4">📦</div>
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
          <FiPackage /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-visible">
            {/* Order header */}
            <div
              className="p-5 cursor-pointer flex items-center justify-between"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPackage size={22} className="text-brand-primary" />
                </div>
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-gray-800">{order.items?.length} items • ₹{order.totalAmount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy, h:mm a') : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                {expanded === order.id ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </div>
            </div>

            {/* Expanded details */}
            {expanded === order.id && (
              <div className="border-t border-gray-100 p-5 space-y-5">
                {/* Tracker */}
                <OrderTracker status={order.status} />

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-gray-700">{item.name} ({item.weight}) × {item.quantity}</span>
                        <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery info */}
                <div className="bg-brand-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Delivery Address</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                  <p className="text-sm text-gray-600 mt-1">📞 {order.phone}</p>
                </div>

                {/* Cancel */}
                {order.status === 'PLACED' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    <FiXCircle size={16} /> Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
