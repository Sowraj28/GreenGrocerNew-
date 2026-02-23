'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiZap, FiPlus, FiMinus } from 'react-icons/fi';

interface Variant {
  id: string;
  weight: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  variants: Variant[];
  category?: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (!session) { router.push('/auth/login'); return; }
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      imageUrl: product.imageUrl || '',
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: qty,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!session) { router.push('/auth/login'); return; }
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      imageUrl: product.imageUrl || '',
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: qty,
    });
    router.push('/checkout');
  };

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-brand-50 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🥬</div>
        )}
        {product.category && (
          <span className="absolute top-2 left-2 badge bg-white/90 text-brand-primary text-xs">
            {product.category.name}
          </span>
        )}
        {selectedVariant?.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display font-bold text-gray-800 text-base leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        {/* Variant selector */}
        <div className="flex flex-wrap gap-1.5">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                selectedVariant?.id === v.id
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'border-gray-200 text-gray-600 hover:border-brand-light'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-brand-dark">₹{selectedVariant?.price}</span>
          <span className="text-xs text-gray-400">{selectedVariant?.weight}</span>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Qty:</span>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-500 hover:text-brand-primary">
              <FiMinus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(Math.min(selectedVariant?.stock || 10, qty + 1))}
              className="text-gray-500 hover:text-brand-primary"
            >
              <FiPlus size={14} />
            </button>
          </div>
          <span className="text-xs text-gray-400 ml-auto">Stock: {selectedVariant?.stock}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={selectedVariant?.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-brand-primary text-brand-primary rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-50 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={15} /> Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={selectedVariant?.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiZap size={15} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
