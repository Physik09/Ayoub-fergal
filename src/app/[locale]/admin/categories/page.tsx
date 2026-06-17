'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { slugify } from '@/lib/utils';

type Category = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  sortOrder: number;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ nameFr: '', nameAr: '', slug: '', sortOrder: 0 });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/categories?page=${page}&limit=20`);
    const data = await res.json();
    setCategories(data.categories || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const resetForm = () => {
    setForm({ nameFr: '', nameAr: '', slug: '', sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ nameFr: cat.nameFr, nameAr: cat.nameAr, slug: cat.slug, sortOrder: cat.sortOrder });
    setEditing(cat);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form };
    const res = editing
      ? await fetch(`/api/categories/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      resetForm();
      fetchCategories();
    } else {
      const err = await res.json();
      alert(err.error || 'Error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t('admin.confirm')}: ${name} ?`)) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.categories')}</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-brand-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          + {t('admin.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">FR *</label>
              <input
                type="text"
                value={form.nameFr}
                onChange={(e) => setForm((prev) => ({ ...prev, nameFr: e.target.value, slug: slugify(e.target.value) }))}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">AR *</label>
              <input
                type="text"
                value={form.nameAr}
                onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Ordre</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">
              {editing ? t('admin.save') : t('admin.add')}
            </button>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:underline">
              {t('admin.cancel')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">FR</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">AR</th>
                  <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Produits</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{cat.nameFr}</td>
                    <td className="px-4 py-3">{cat.nameAr}</td>
                    <td className="px-4 py-3 text-center">{cat._count.products}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(cat)} className="text-xs text-brand-gold hover:underline mr-3">
                        {t('admin.edit')}
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.nameFr)} className="text-xs text-red-500 hover:underline">
                        {t('admin.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors">
                {t('admin.prev')}
              </button>
              <span className="text-xs text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors">
                {t('admin.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
