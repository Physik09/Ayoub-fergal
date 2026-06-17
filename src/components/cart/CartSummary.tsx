'use client';

import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  city?: string;
}

export function CartSummary({ subtotal, city }: CartSummaryProps) {
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : city
      ? DELIVERY_FEES[city] || 35
      : DELIVERY_FEES.Casablanca;

  const total = subtotal + deliveryFee;

  return (
    <div className="border border-gray-200 p-6 h-fit sticky top-28">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Récapitulatif</h2>

      <div className="space-y-2 text-sm">
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
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout">
        <Button variant="primary" className="w-full mt-6">
          Commander
        </Button>
      </Link>
    </div>
  );
}
