'use client';

import { formatPrice } from '@/lib/utils';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface OrderReviewProps {
  items: OrderItem[];
  subtotal: number;
  city: string;
  loading?: boolean;
  error?: string;
  onSubmit: () => void;
}

export function OrderReview({
  items,
  subtotal,
  city,
  loading,
  error,
  onSubmit,
}: OrderReviewProps) {
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : city
      ? DELIVERY_FEES[city] || 35
      : 0;

  const total = subtotal + deliveryFee;

  return (
    <div className="border border-gray-200 p-6 sticky top-28">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Récapitulatif</h2>

      <div className="space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4">
            <span className="text-gray-600 truncate">
              {item.name}
              {item.size && ` (${item.size})`}
              <span className="text-gray-400"> ×{item.quantity}</span>
            </span>
            <span className="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Livraison</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="text-green-600 text-xs font-medium">GRATUITE</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>
        {subtotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-gray-400">
            Plus que {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} pour la livraison gratuite
          </p>
        )}
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <Button
        variant="primary"
        className="w-full mt-6"
        loading={loading}
        onClick={onSubmit}
      >
        CONFIRMER LA COMMANDE
      </Button>
    </div>
  );
}
