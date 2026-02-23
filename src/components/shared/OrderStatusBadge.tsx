const statusMap: Record<string, { label: string; className: string; icon: string }> = {
  PLACED: { label: 'Order Placed', className: 'badge-placed', icon: '📦' },
  PACKING: { label: 'Packing', className: 'badge-packing', icon: '🎁' },
  DISPATCHED: { label: 'Dispatched', className: 'badge-dispatched', icon: '🚚' },
  DELIVERED: { label: 'Delivered', className: 'badge-delivered', icon: '✅' },
  CANCELLED: { label: 'Cancelled', className: 'badge-cancelled', icon: '❌' },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const s = statusMap[status] || statusMap.PLACED;
  return (
    <span className={`badge ${s.className}`}>
      {s.icon} {s.label}
    </span>
  );
}
