'use client';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import { FiPrinter, FiX } from 'react-icons/fi';

interface InvoiceProps {
  order: any;
  onClose: () => void;
  onItemCheck: (itemId: string, checked: boolean) => void;
}

export default function InvoiceModal({ order, onClose, onItemCheck }: InvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
        {/* Actions bar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 no-print">
          <h3 className="font-display text-xl font-bold text-gray-800">Invoice / Packing Slip</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors">
              <FiPrinter size={16} /> Print
            </button>
            <button onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div ref={printRef} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-dark">🌿 GreenGrocer</h1>
              <p className="text-gray-500 text-sm mt-1">Fresh Organic Groceries</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Invoice</p>
              <p className="font-mono font-bold text-gray-800">#{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-gray-400 mt-1">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Customer</p>
              <p className="font-semibold text-gray-800">{order.user?.name}</p>
              <p className="text-sm text-gray-500">{order.user?.email}</p>
              <p className="text-sm text-gray-500">📞 {order.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Delivery Address</p>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>
          </div>

          {/* Items table with checkboxes */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left pb-2 text-gray-500 text-xs uppercase font-semibold w-10">✓</th>
                <th className="text-left pb-2 text-gray-500 text-xs uppercase font-semibold">Item</th>
                <th className="text-center pb-2 text-gray-500 text-xs uppercase font-semibold">Weight</th>
                <th className="text-center pb-2 text-gray-500 text-xs uppercase font-semibold">Qty</th>
                <th className="text-right pb-2 text-gray-500 text-xs uppercase font-semibold">Price</th>
                <th className="text-right pb-2 text-gray-500 text-xs uppercase font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => onItemCheck(item.id, e.target.checked)}
                      className="w-4 h-4 accent-green-700 rounded cursor-pointer"
                    />
                  </td>
                  <td className="py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="py-3 text-center text-gray-500 text-sm">{item.weight}</td>
                  <td className="py-3 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">₹{item.price}</td>
                  <td className="py-3 text-right font-bold text-gray-800">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 text-gray-800">
                <span>Total Paid</span>
                <span className="text-brand-dark">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
            <p>Payment: <span className="text-green-600 font-semibold">PAID</span></p>
            <p>Status: <span className="font-semibold text-gray-700">{order.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
