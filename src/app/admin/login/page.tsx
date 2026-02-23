"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("admin-credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });
    setLoading(false);
    if (res?.ok) {
      toast.success("Admin access granted");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GiWheat size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Portal
          </h1>
          <p className="text-green-200 mt-1 text-sm">
            GreenGrocer Management System
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <FiShield className="text-brand-primary" size={20} />
            <span className="text-sm font-semibold text-gray-600">
              Secure Admin Access Only
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="admin@greengrocer.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Admin password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-white py-3 rounded-xl font-semibold hover:bg-black transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Access Admin Panel"
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <strong>Note:</strong> Admin credentials are separate from customer
            accounts.
          </div>
        </div>
      </div>
    </div>
  );
}
