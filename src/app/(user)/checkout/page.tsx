'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { FiLock, FiMapPin, FiPhone, FiUser, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Step = 'address' | 'payment' | 'processing' | 'success';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('address');
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({ address: '', phone: '' });

  const total = totalPrice();
  const delivery = total >= 500 ? 0 : 40;
  const grandTotal = total + delivery;

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setStep('processing');
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            weight: i.weight,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount: grandTotal,
          address: form.address,
          phone: form.phone,
        }),
      });

      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      setOrderId(order.id);
      clearCart();
      setStep('success');
    } catch {
      setStep('payment');
      toast.error('Order failed. Please try again.');
    }
  };

  if (step === 'processing') {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-50 border-4 border-brand-primary border-t-transparent animate-spin mx-auto mb-6" />
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
        <p className="text-gray-500">Please wait while we confirm your payment...</p>
        <div className="mt-6 space-y-2 text-sm text-gray-400">
          <p>✓ Verifying payment details</p>
          <p>✓ Connecting to payment gateway</p>
          <p className="animate-pulse">⟳ Confirming transaction...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FiCheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h2>
        <p className="text-gray-500 mb-6">Your order has been placed successfully</p>
        <div className="card p-6 text-left mb-6">
          <p className="text-sm text-gray-400 mb-1">Order ID</p>
          <p className="font-mono font-bold text-brand-primary text-lg">#{orderId.slice(-8).toUpperCase()}</p>
          <div className="mt-4 flex items-center gap-2 text-brand-primary">
            <span className="badge badge-placed">📦 Order Placed</span>
            <span className="text-xs text-gray-400">→ Packing → Dispatched → Delivered</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="btn-primary flex-1 text-center block">Track Order</Link>
          <Link href="/shop" className="btn-outline flex-1 text-center block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'address' && (
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-brand-primary" /> Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={session.user?.name || ''} disabled
                      className="input-field pl-10 bg-gray-50 text-gray-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      placeholder="Enter 10-digit phone number"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="input-field pl-10" maxLength={10}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <textarea
                    placeholder="Enter your full delivery address"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="input-field resize-none"
                    rows={4}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!form.phone || !form.address) { toast.error('Please fill all fields'); return; }
                    setStep('payment');
                  }}
                  className="btn-primary w-full"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiLock className="text-brand-primary" /> Payment
              </h2>
              <div className="bg-brand-50 border border-brand-light rounded-xl p-4 mb-4">
                <p className="text-brand-primary font-semibold text-sm">🔒 Demo Payment Mode</p>
                <p className="text-gray-600 text-sm mt-1">This is a demo. Click "Pay Now" to simulate payment.</p>
              </div>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer bg-brand-50 border-brand-primary">
                  <div className="w-4 h-4 rounded-full border-4 border-brand-primary" />
                  <span className="font-medium text-gray-700">💳 Demo Payment (Instant)</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('address')} className="btn-outline flex-1">← Back</button>
                <button onClick={handlePlaceOrder} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiLock size={16} /> Pay ₹{grandTotal}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-display text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate flex-1 mr-2">
                  {item.name} ({item.weight}) × {item.quantity}
                </span>
                <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'text-green-600 font-semibold' : ''}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2">
              <span>Total</span><span className="text-brand-dark">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
