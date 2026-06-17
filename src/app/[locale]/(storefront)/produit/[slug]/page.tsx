'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/lib/auth';
import { ImageGallery, SizeSelector, ColorSelector, AddToCartButton, SizeGuideModal } from '@/components/product';
import { QuantitySelector } from '@/components/ui/QuantitySelector';

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  sku: string;
};

type Product = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  sellPrice: number;
  images: string[];
  category: { nameFr: string; nameAr: string } | null;
  variants: Variant[];
};

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = useTranslations();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState('');
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<{ id: string; author: string; rating: number; title: string; comment: string; createdAt: string }[]>([]);
  const [reviewAvg, setReviewAvg] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, title: '', comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    paramsPromise.then((p) => setSlug(p.slug));
  }, [paramsPromise]);

  useEffect(() => {
    if (product) {
      document.title = `${product.nameFr} — ${t('site.title')}`;
    }
  }, [product, t]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
        return data.id;
      })
      .then((productId) => {
        if (productId) {
          fetch(`/api/products/${productId}/reviews`)
            .then((r) => r.json())
            .then((data) => {
              setReviews(data.reviews ?? []);
              setReviewAvg(data.average ?? 0);
              setReviewCount(data.count ?? 0);
            })
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const toggleWishlist = async () => {
    if (!user) return;
    setIsWishlisted(!isWishlisted);
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, productId: product?.id }),
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">{t('shop.noResults')}</p>
        <Link href="/shop" className="text-brand-gold hover:underline text-sm">
          {t('nav.shop')}
        </Link>
      </div>
    );
  }

  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color as string))];
  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size as string))];
  const currentVariant = product.variants.find(
    (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
  );
  const inStock = currentVariant ? currentVariant.stock > 0 : product.variants.some((v) => v.stock > 0);
  const currentStock = currentVariant?.stock || 0;

  const handleAddToCart = () => {
    const id = `${product.id}-${selectedSize || ''}-${selectedColor || ''}`;
    addItem({
      id,
      productId: product.id,
      variantId: currentVariant?.id,
      name: product.nameFr,
      slug: product.slug,
      image: product.images?.[0] || '',
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      price: product.sellPrice,
      stock: currentStock || 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <ImageGallery images={product.images || []} productName={product.nameFr} />

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {product.category?.nameFr}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.05em]">
              {product.nameFr}
            </h1>
            <p className="text-xl font-semibold mt-2">
              {formatPrice(product.sellPrice)}
            </p>
            {user && (
              <button
                onClick={toggleWishlist}
                className="mt-3 text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={isWishlisted ? 'text-red-500' : ''}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isWishlisted ? t('product.wishlisted') : t('product.addToWishlist')}
              </button>
            )}
          </div>

          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
            variants={product.variants}
          />

          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              {t('product.size')}
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs text-brand-gold hover:underline"
            >
              {t('product.sizeGuide')}
            </button>
          </div>
          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
            variants={product.variants}
            selectedColor={selectedColor}
          />

          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={currentStock || 99}
          />
          {currentStock > 0 && currentStock <= 5 && (
            <p className="text-xs text-yellow-600 mt-1">
              {t('product.lowStock', { count: currentStock })}
            </p>
          )}

          <AddToCartButton
            inStock={inStock}
            onAdd={handleAddToCart}
          />

          <div className="border-t border-gray-200 pt-6 space-y-4">
            {product.descriptionFr && (
              <details className="group" open>
                <summary className="text-sm font-medium uppercase tracking-wider cursor-pointer list-none flex items-center justify-between">
                  {t('product.description')}
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {product.descriptionFr}
                </p>
              </details>
            )}
            <details className="group">
              <summary className="text-sm font-medium uppercase tracking-wider cursor-pointer list-none flex items-center justify-between">
                {t('product.shipping')}
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {t('product.shippingInfo')}
              </p>
            </details>
            <details className="group">
              <summary className="text-sm font-medium uppercase tracking-wider cursor-pointer list-none flex items-center justify-between">
                {t('product.composition')}
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {t('product.compositionInfo')}
              </p>
            </details>

            <details className="group">
              <summary className="text-sm font-medium uppercase tracking-wider cursor-pointer list-none flex items-center justify-between">
                {t('product.reviews')} {reviewCount > 0 && `(${reviewCount})`}
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="mt-4 space-y-4">
                {reviewAvg > 0 && (
                  <p className="text-sm text-gray-500">{t('product.averageRating', { rating: reviewAvg.toFixed(1) })}</p>
                )}

                {reviews.length === 0 && !reviewSubmitted && (
                  <p className="text-sm text-gray-400">{t('product.noReviews')}</p>
                )}

                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="text-sm font-medium">{r.author}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.title && <p className="text-sm font-medium mb-0.5">{r.title}</p>}
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))}

                {reviewSubmitted ? (
                  <p className="text-sm text-green-600">{t('product.reviewThanks')}</p>
                ) : user ? (
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                    <p className="text-sm font-medium">{t('product.writeReview')}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{t('product.reviewRating')} :</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                          className={`text-lg ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={t('product.reviewTitle')}
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
                    />
                    <textarea
                      placeholder={t('product.reviewComment')}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      required
                      rows={3}
                      className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold resize-none"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!reviewForm.comment) return;
                        setReviewSubmitting(true);
                        try {
                          await fetch(`/api/products/${product.id}/reviews`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...reviewForm, userId: user.id }),
                          });
                          setReviewSubmitted(true);
                        } catch {}
                        setReviewSubmitting(false);
                      }}
                      disabled={reviewSubmitting || !reviewForm.comment}
                      className="bg-brand-black text-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {reviewSubmitting ? '...' : t('product.submitReview')}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    <Link href="/auth/login" className="text-brand-gold hover:underline">{t('product.loginToReview')}</Link>
                  </p>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
