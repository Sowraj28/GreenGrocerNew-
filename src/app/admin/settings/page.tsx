'use client';
import { useSession } from 'next-auth/react';
import { FiUser, FiSettings, FiDatabase, FiCloud } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-gray-800">Settings</h1>

      {/* Admin info */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiUser className="text-brand-primary" /> Admin Account
        </h2>
        <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl">
          <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{session?.user?.name}</p>
            <p className="text-gray-500">{session?.user?.email}</p>
            <span className="badge bg-brand-primary text-white mt-1">Administrator</span>
          </div>
        </div>
      </div>

      {/* App config */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiSettings className="text-brand-primary" /> App Configuration
        </h2>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600 font-medium">App Name</span>
            <span className="font-semibold text-gray-800">GreenGrocer</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600 font-medium">Free Delivery Above</span>
            <span className="font-semibold text-gray-800">₹500</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600 font-medium">Delivery Charge</span>
            <span className="font-semibold text-gray-800">₹40</span>
          </div>
        </div>
      </div>

      {/* DB & Cloud info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiDatabase className="text-blue-500" /> Database
          </h3>
          <p className="text-sm text-gray-500">PostgreSQL via Neon</p>
          <span className="badge bg-green-100 text-green-700 mt-2">Connected</span>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiCloud className="text-purple-500" /> Storage
          </h3>
          <p className="text-sm text-gray-500">Cloudinary CDN</p>
          <span className="badge bg-green-100 text-green-700 mt-2">Configured</span>
        </div>
      </div>
    </div>
  );
}
