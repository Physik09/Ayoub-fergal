import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

type Product = {
  slug: string;
  nameFr: string;
  nameAr: string;
  sellPrice: number;
  images: string[];
  category: { nameFr: string } | null;
  variants: { stock: number }[];
};

type Props = {
  products: Product[];
  locale: string;
};

export function FeaturedProducts({ products, locale }: Props) {
  const t = useTranslations();

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase">
            {t('featured.title')}
          </h2>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.15em] text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors"
          >
            {t('featured.viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const inStock = product.variants.some((v) => v.stock > 0);
            return (
              <Link
                key={product.slug}
                href={`/produit/${product.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden relative">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.nameFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wider">
                      Image
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs uppercase tracking-wider font-medium">
                        {t('shop.soldOut')}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-gold transition-colors">
                  {locale === 'fr' ? product.nameFr : product.nameAr}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPrice(product.sellPrice)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
