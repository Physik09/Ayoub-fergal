'use client';

import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { QuantitySelector } from '@/components/ui/QuantitySelector';

interface CartItemData {
  id: string;
  slug: string;
  name: string;
  image: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 border border-gray-200 p-4">
      <Link href={`/produit/${item.slug}`} className="w-24 h-24 bg-gray-100 flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            Img
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/produit/${item.slug}`}
          className="text-sm font-medium hover:text-brand-gold transition-colors"
        >
          {item.name}
        </Link>
        {(item.size || item.color) && (
          <p className="text-xs text-gray-500 mt-0.5">
            {item.size && `Taille: ${item.size}`}
            {item.size && item.color && ' | '}
            {item.color && `Couleur: ${item.color}`}
          </p>
        )}
        <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <QuantitySelector
          value={item.quantity}
          min={1}
          max={item.stock}
          onChange={(q) => onUpdateQuantity(item.id, q)}
          size="sm"
        />
        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-xs text-red-500 hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
