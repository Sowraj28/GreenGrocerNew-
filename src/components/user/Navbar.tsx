'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import {
  FiShoppingCart, FiUser, FiLogOut, FiPackage, FiMenu, FiX,
  FiHome, FiGrid, FiChevronDown,
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function UserNavbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-dark transition-colors">
              <GiWheat className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-brand-dark">Green</span>
              <span className="font-display text-xl font-bold text-brand-primary">Grocer</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/shop" className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-brand-primary hover:bg-brand-50 font-medium transition-all">
              <FiHome size={16} /> Shop
            </Link>
            <Link href="/cart" className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-brand-primary hover:bg-brand-50 font-medium transition-all">
              <FiGrid size={16} /> Categories
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-brand-50 transition-colors group">
              <FiShoppingCart size={22} className="text-gray-600 group-hover:text-brand-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="font-semibold text-gray-800 text-sm truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 text-gray-600 hover:text-brand-primary transition-colors text-sm">
                      <FiPackage size={16} /> My Orders
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: '/auth/login' }); setUserOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors text-sm">
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2 px-4 hidden sm:flex items-center gap-2">
                <FiUser size={15} /> Sign In
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-brand-50">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link href="/shop" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 text-gray-600 font-medium">
            <FiHome size={18} /> Shop
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 text-gray-600 font-medium">
            <FiShoppingCart size={18} /> Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {session && (
            <Link href="/orders" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-50 text-gray-600 font-medium">
              <FiPackage size={18} /> My Orders
            </Link>
          )}
          {!session && (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary text-white font-medium">
              <FiUser size={18} /> Sign In
            </Link>
          )}
          {session && (
            <button onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium">
              <FiLogOut size={18} /> Sign Out
            </button>
          )}
        </div>
      )}

      {/* Backdrop */}
      {userOpen && <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />}
    </nav>
  );
}
