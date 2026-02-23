'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Sign in to view your cart</h2>
        <p className="text-gray-400 mb-6">Please sign in to continue shopping</p>
        <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">Sign In <FiArrowRight /></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some fresh products to get started</p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  const total = totalPrice();
  const delivery = total >= 500 ? 0 : 40;
  const grandTotal = total + delivery;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-brand-50">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-3xl">🥬</div>}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.weight}</p>
                <p className="text-brand-primary font-bold">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <FiTrash2 size={18} />
                </button>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5">
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="text-gray-500 hover:text-brand-primary"><FiMinus size={14} /></button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className="text-gray-500 hover:text-brand-primary"><FiPlus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold">₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-brand-primary bg-brand-50 p-2 rounded-lg">
                  Add ₹{500 - total} more for free delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-brand-dark">₹{grandTotal}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link href="/shop" className="block text-center mt-3 text-sm text-brand-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
