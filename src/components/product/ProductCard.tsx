'use client';

import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ProductImagePlaceholder } from '@/lib/images/ProductImagePlaceholder';

type ProductVariantSummary = { stock: number }[];

interface ProductCardProps {
  slug: string;
  name: string;
  sellPrice: number;
  images: string[];
  variants: ProductVariantSummary;
  locale?: string;
}

export function ProductCard({ slug, name, sellPrice, images, variants }: ProductCardProps) {
  const inStock = variants.some((v) => v.stock > 0);

  return (
    <Link href={`/produit/${slug}`} className="group">
      <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden relative">
        {images && images[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <ProductImagePlaceholder className="w-full h-full" />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs uppercase tracking-wider font-medium">
              Rupture de stock
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-gold transition-colors">
        {name}
      </h3>
      <p className="text-sm text-gray-600 mt-1">{formatPrice(sellPrice)}</p>
    </Link>
  );
}
