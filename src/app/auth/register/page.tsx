'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setLoading(false); toast.error(data.error || 'Registration failed'); return; }

    await signIn('user-credentials', { email: form.email, password: form.password, redirect: false });
    toast.success('Account created! Welcome! 🌿');
    router.push('/shop');
    setLoading(false);
  };

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <GiWheat size={32} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-dark">Create Account</h1>
        <p className="text-gray-500 mt-1">Join GreenGrocer today</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', Icon: FiUser, type: 'text', placeholder: 'Your full name' },
            { key: 'email', label: 'Email', Icon: FiMail, type: 'email', placeholder: 'you@example.com' },
            { key: 'phone', label: 'Phone Number', Icon: FiPhone, type: 'tel', placeholder: '10-digit phone number' },
          ].map(({ key, label, Icon, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type={type} placeholder={placeholder} value={(form as any)[key]} onChange={update(key)}
                  required className="input-field pl-10" />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-3.5 text-gray-400" size={17} />
              <textarea placeholder="Full delivery address" value={form.address} onChange={update('address')}
                className="input-field pl-10 resize-none" rows={2} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                onChange={update('password')} required className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input type="password" placeholder="Confirm password" value={form.confirm}
                onChange={update('confirm')} required className="input-field pl-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
