'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { slugify } from '@/lib/utils';

type Category = { id: string; slug: string; nameFr: string; nameAr: string };
type Supplier = { id: string; name: string };

export default function ProductForm({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations();
  const router = useRouter();
  const isNew = typeof window !== 'undefined' && window.location.pathname.endsWith('/new');

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    slug: '',
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    categoryId: '',
    supplierId: '',
    costPrice: '',
    sellPrice: '',
    images: '',
    status: 'DRAFT',
    featured: false,
  });
  const [variants, setVariants] = useState<{ size: string; color: string; colorHex: string; stock: number; sku: string }[]>([]);
  const [imageFeedback, setImageFeedback] = useState('');

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((data) => setCategories(data.categories ?? []));
    fetch('/api/suppliers').then((r) => r.json()).then(setSuppliers);

    if (!isNew) {
      params.then((p) => {
        fetch(`/api/products/${p.id}`).then((r) => r.json()).then((product) => {
          setForm({
            slug: product.slug,
            nameFr: product.nameFr,
            nameAr: product.nameAr,
            descriptionFr: product.descriptionFr || '',
            descriptionAr: product.descriptionAr || '',
            categoryId: product.categoryId || '',
            supplierId: product.supplierId || '',
            costPrice: product.costPrice?.toString() || '',
            sellPrice: product.sellPrice.toString(),
            images: product.images?.join(', ') || '',
            status: product.status,
            featured: product.featured,
          });
          setVariants(product.variants || []);
        });
      });
    }
  }, [isNew, params]);

  const handleNameChange = (field: 'nameFr' | 'nameAr', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      slug: field === 'nameFr' ? slugify(value) : prev.slug,
    }));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: '', color: '', colorHex: '#000000', stock: 0, sku: '' }]);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...form,
      costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
      sellPrice: parseFloat(form.sellPrice),
      images: form.images ? form.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      variants: variants.filter((v) => v.sku),
    };

    const url = isNew ? '/api/products' : `/api/products/${(await params).id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      const err = await res.json();
      alert(err.error || 'Error saving product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-6">
        {isNew ? '+ ' + t('admin.add') : t('admin.edit')} {t('admin.products')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('common.french')} *</label>
            <input
              type="text"
              value={form.nameFr}
              onChange={(e) => handleNameChange('nameFr', e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('common.arabic')} *</label>
            <input
              type="text"
              value={form.nameAr}
              onChange={(e) => handleNameChange('nameAr', e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            required
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('admin.categories')}</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="">--</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameFr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('admin.suppliers')}</label>
            <select
              value={form.supplierId}
              onChange={(e) => setForm((prev) => ({ ...prev, supplierId: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="">--</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Prix de vente *</label>
            <input
              type="number"
              step="0.01"
              value={form.sellPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, sellPrice: e.target.value }))}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Prix de revient</label>
            <input
              type="number"
              step="0.01"
              value={form.costPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, costPrice: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('admin.status')}</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="ACTIVE">Actif</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="accent-brand-gold"
              />
              <span className="text-sm">En vedette</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Description (FR)</label>
            <textarea
              value={form.descriptionFr}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionFr: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold resize-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Description (AR)</label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionAr: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold resize-none"
            />
          </div>
        </div>

          <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs uppercase tracking-wider text-gray-500">Images</label>
            <button
              type="button"
              onClick={async () => {
                setImageFeedback('');
                const categoryId = form.categoryId;
                if (!categoryId) { setImageFeedback('Sélectionnez d\'abord une catégorie'); return; }
                const cat = categories.find((c) => c.id === categoryId);
                if (!cat) { setImageFeedback('Catégorie introuvable'); return; }
                setImageFeedback('Recherche en cours...');
                const res = await fetch('/api/images/suggest', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: form.nameFr,
                    categorySlug: cat.slug,
                  }),
                });
                const data = await res.json();
                if (data.error) { setImageFeedback(data.error); return; }
                if (data.images?.length) {
                  const urls = data.images.map((img: { url: string }) => img.url).join(', ');
                  setForm((prev) => ({ ...prev, images: urls }));
                  setImageFeedback(`${data.images.length} image(s) trouvée(s)`);
                } else {
                  setImageFeedback('Aucune image trouvée. Vérifiez votre clé API Pexels.');
                }
              }}
              className="text-xs text-brand-gold hover:underline"
            >
              🔍 Suggérer des images Pexels
            </button>
            {imageFeedback && (
              <span className="text-xs text-gray-400 ml-2">{imageFeedback}</span>
            )}

          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.url) {
                  setForm((prev) => ({ ...prev, images: prev.images ? `${prev.images}, ${data.url}` : data.url }));
                }
              }}
              className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-gray-100 file:hover:bg-gray-200 file:cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={form.images}
            onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))}
            placeholder="Ou entrez des URLs séparées par des virgules"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Variantes</label>
            <button type="button" onClick={addVariant} className="text-xs text-brand-gold hover:underline">+ Ajouter</button>
          </div>
          {variants.length > 0 && (
            <div className="border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs text-gray-500">SKU</th>
                    <th className="text-left px-3 py-2 text-xs text-gray-500">Taille</th>
                    <th className="text-left px-3 py-2 text-xs text-gray-500">Couleur</th>
                    <th className="text-left px-3 py-2 text-xs text-gray-500">Hex</th>
                    <th className="text-right px-3 py-2 text-xs text-gray-500">Stock</th>
                    <th className="text-center px-3 py-2 text-xs text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                          className="w-full border border-gray-200 px-2 py-1 text-xs outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={v.size}
                          onChange={(e) => updateVariant(i, 'size', e.target.value)}
                          className="w-full border border-gray-200 px-2 py-1 text-xs outline-none"
                        >
                          <option value="">--</option>
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => updateVariant(i, 'color', e.target.value)}
                          className="w-full border border-gray-200 px-2 py-1 text-xs outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="color"
                          value={v.colorHex}
                          onChange={(e) => updateVariant(i, 'colorHex', e.target.value)}
                          className="w-8 h-8 p-0 border-0 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-200 px-2 py-1 text-xs outline-none text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-black text-white px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : isNew ? t('admin.add') : t('admin.save')}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
