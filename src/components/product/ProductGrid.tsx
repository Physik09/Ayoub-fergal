import { ProductCard } from './ProductCard';

type Product = {
  slug: string;
  nameFr: string;
  nameAr: string;
  sellPrice: number;
  images: string[];
  variants: { stock: number }[];
};

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          slug={product.slug}
          name={locale === 'fr' ? product.nameFr : product.nameAr}
          sellPrice={product.sellPrice}
          images={product.images}
          variants={product.variants}
          locale={locale}
        />
      ))}
    </div>
  );
}
