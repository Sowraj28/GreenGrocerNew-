"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiBell,
  FiShoppingBag,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

interface Order {
  id: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userOpen, setUserOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const prevOrderIds = useRef<Set<string>>(new Set());

  // Poll for new orders every 15 seconds
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) return;
        const data: Order[] = await res.json();
        // Only PLACED orders, newest first, max 20
        const placed = data
          .filter((o: any) => o.status === "PLACED")
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 20);

        setOrders(placed);

        // Find brand new orders not seen before
        const newIds = new Set<string>();
        placed.forEach((o) => {
          if (!prevOrderIds.current.has(o.id)) {
            newIds.add(o.id);
          }
        });

        if (newIds.size > 0) {
          setUnreadIds((prev) => {
            const updated = new Set(prev);
            newIds.forEach((id) => updated.add(id));
            return updated;
          });
        }

        prevOrderIds.current = new Set(placed.map((o) => o.id));
      } catch {}
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = orders.filter(
    (o) => unreadIds.has(o.id) && !seenIds.has(o.id),
  ).length;

  const handleBellOpen = () => {
    setBellOpen(!bellOpen);
    // Mark all current unread as seen when opening
    if (!bellOpen) {
      setSeenIds((prev) => {
        const updated = new Set(prev);
        unreadIds.forEach((id) => updated.add(id));
        return updated;
      });
    }
  };

  const handleOrderClick = (orderId: string) => {
    setBellOpen(false);
    router.push("/admin/orders");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-100 lg:hidden"
      >
        <FiMenu size={22} className="text-gray-600" />
      </button>

      <h2 className="font-display text-lg font-bold text-brand-dark hidden lg:block">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-3 ml-auto">
        {/* Bell icon with dropdown */}
        <div className="relative">
          <button
            onClick={handleBellOpen}
            className="p-2 rounded-xl hover:bg-gray-100 relative"
          >
            <FiBell size={20} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-sm">
                  New Orders
                </p>
                {orders.length > 0 && (
                  <span className="text-xs text-brand-primary font-medium">
                    {orders.length} pending
                  </span>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FiBell size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No new orders</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {orders.map((order) => {
                    const isNew =
                      unreadIds.has(order.id) && !seenIds.has(order.id);
                    return (
                      <button
                        key={order.id}
                        onClick={() => handleOrderClick(order.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${isNew ? "bg-green-50" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isNew ? "bg-brand-primary" : "bg-gray-100"}`}
                        >
                          <FiShoppingBag
                            size={14}
                            className={isNew ? "text-white" : "text-gray-500"}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {order.user?.name || "Customer"}
                            </p>
                            {isNew && (
                              <span className="text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{order.totalAmount.toLocaleString()} • Order placed
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    router.push("/admin/orders");
                    setBellOpen(false);
                  }}
                  className="w-full text-center text-xs text-brand-primary font-semibold py-1 hover:text-brand-dark transition-colors"
                >
                  View all orders →
                </button>
              </div>
            </div>
          )}

          {bellOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setBellOpen(false)}
            />
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <FiChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${userOpen ? "rotate-180" : ""}`}
            />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Admin
                </p>
                <p className="text-sm text-gray-700 font-medium truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors text-sm"
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {userOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserOpen(false)}
        />
      )}
    </header>
  );
}
