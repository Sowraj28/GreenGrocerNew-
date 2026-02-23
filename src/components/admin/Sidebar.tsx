'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiX } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import clsx from 'clsx';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/orders', label: 'Orders', icon: FiPackage },
  { href: '/admin/products', label: 'Products', icon: FiShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: FiUsers },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center">
            <GiWheat className="text-white text-lg" />
          </div>
          <div>
            <p className="font-display font-bold text-brand-dark text-base leading-tight">GreenGrocer</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg lg:hidden">
            <FiX size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={clsx('sidebar-link', pathname.startsWith(href) && 'active')}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-center text-gray-300">GreenGrocer Admin v1.0</p>
      </div>
    </div>
  );
}
