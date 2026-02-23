'use client';

const steps = [
  { key: 'PLACED', label: 'Order Placed', icon: '📦', desc: 'Your order has been confirmed' },
  { key: 'PACKING', label: 'Packing', icon: '🎁', desc: 'Items are being packed' },
  { key: 'DISPATCHED', label: 'Dispatched', icon: '🚚', desc: 'Out for delivery' },
  { key: 'DELIVERED', label: 'Delivered', icon: '✅', desc: 'Delivered successfully' },
];

const statusOrder = ['PLACED', 'PACKING', 'DISPATCHED', 'DELIVERED'];

export default function OrderTracker({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-10">
          <div
            className="h-full bg-brand-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, i) => {
          const isCompleted = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10
                transition-all duration-300 border-2
                ${isCompleted
                  ? 'bg-brand-primary border-brand-primary shadow-lg shadow-green-200'
                  : 'bg-white border-gray-200'}
                ${isCurrent ? 'ring-4 ring-brand-light' : ''}
              `}>
                {step.icon}
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold ${isCompleted ? 'text-brand-primary' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
