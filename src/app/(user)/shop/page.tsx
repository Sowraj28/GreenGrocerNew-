'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/user/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface Category { id: string; name: string; }
interface Product {
  id: string; name: string; description?: string; imageUrl?: string;
  variants: { id: string; weight: string; price: number; stock: number }[];
  category?: { name: string };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (search) params.set('search', search);
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, [selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8 text-center bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl p-8 sm:p-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-dark mb-3">
          Fresh From Farm 🌿
        </h1>
        <p className="text-brand-primary text-lg font-medium mb-6">
          Premium organic groceries, delivered fresh to your door
        </p>
        {/* Search bar */}
        <div className="max-w-lg mx-auto relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for vegetables, fruits, grains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
            !selectedCategory ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-brand-50 border border-gray-200'
          }`}
        >
          All Products
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              selectedCategory === c.id ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-brand-50 border border-gray-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                  <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🥬</p>
          <h3 className="text-xl font-display font-bold text-gray-700">No products found</h3>
          <p className="text-gray-400 mt-2">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setSelectedCategory(''); }}
            className="btn-primary mt-4">View All Products</button>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{products.length} products found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
