'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';

type Banner = {
  id: string;
  titleFr: string | null;
  titleAr: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

type Collection = {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminContentPage() {
  const t = useTranslations();
  const [tab, setTab] = useState<'banners' | 'collections'>('banners');

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-6">{t('admin.content')}</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('banners')}
          className={`pb-3 text-sm uppercase tracking-wider transition-colors ${
            tab === 'banners' ? 'text-brand-gold border-b-2 border-brand-gold font-medium' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bannières
        </button>
        <button
          onClick={() => setTab('collections')}
          className={`pb-3 text-sm uppercase tracking-wider transition-colors ${
            tab === 'collections' ? 'text-brand-gold border-b-2 border-brand-gold font-medium' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Collections
        </button>
      </div>

      {tab === 'banners' ? <BannerManager /> : <CollectionManager />}
    </div>
  );
}

function BannerManager() {
  const t = useTranslations();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ titleFr: '', titleAr: '', subtitleFr: '', subtitleAr: '', imageUrl: '', linkUrl: '', sortOrder: 0 });

  const loadBanners = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/banners?page=${page}&limit=20`);
    const data = await res.json();
    setBanners(data.banners || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { loadBanners(); }, [loadBanners]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const resetForm = () => {
    setForm({ titleFr: '', titleAr: '', subtitleFr: '', subtitleAr: '', imageUrl: '', linkUrl: '', sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (b: Banner) => {
    setForm({ titleFr: b.titleFr || '', titleAr: b.titleAr || '', subtitleFr: '', subtitleAr: '', imageUrl: b.imageUrl, linkUrl: b.linkUrl || '', sortOrder: b.sortOrder });
    setEditing(b);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, sortOrder: form.sortOrder };
    const res = editing
      ? await fetch(`/api/banners/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); loadBanners(); }
    else { const err = await res.json(); alert(err.error || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirmer ?')) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    loadBanners();
  };

  if (loading) return <p className="text-gray-500 text-sm">{t('common.loading')}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{banners.length} bannières</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-gray-800">
          + {t('admin.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Titre FR</label>
              <input type="text" value={form.titleFr} onChange={(e) => setForm((prev) => ({ ...prev, titleFr: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Titre AR</label>
              <input type="text" value={form.titleAr} onChange={(e) => setForm((prev) => ({ ...prev, titleAr: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Image URL *</label>
            <input type="url" value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Lien</label>
              <input type="text" value={form.linkUrl} onChange={(e) => setForm((prev) => ({ ...prev, linkUrl: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Ordre</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">{editing ? t('admin.save') : t('admin.add')}</button>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:underline">{t('admin.cancel')}</button>
          </div>
        </form>
      )}

      {banners.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Image</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Titre FR</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Actif</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                      {b.imageUrl && <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">{b.titleFr || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.isActive ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(b)} className="text-xs text-brand-gold hover:underline mr-3">{t('admin.edit')}</button>
                    <button onClick={() => handleDelete(b.id)} className="text-xs text-red-500 hover:underline">{t('admin.delete')}</button>
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

function CollectionManager() {
  const t = useTranslations();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState({ nameFr: '', nameAr: '', slug: '', image: '', sortOrder: 0 });

  const loadCollections = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/collections?page=${page}&limit=20`);
    const data = await res.json();
    setCollections(data.collections || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const resetForm = () => {
    setForm({ nameFr: '', nameAr: '', slug: '', image: '', sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (c: Collection) => {
    setForm({ nameFr: c.nameFr, nameAr: c.nameAr, slug: c.slug, image: c.image || '', sortOrder: c.sortOrder });
    setEditing(c);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, sortOrder: form.sortOrder };
    const res = editing
      ? await fetch(`/api/collections/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); loadCollections(); }
    else { const err = await res.json(); alert(err.error || 'Error'); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirmer: ${name} ?`)) return;
    await fetch(`/api/collections/${id}`, { method: 'DELETE' });
    loadCollections();
  };

  if (loading) return <p className="text-gray-500 text-sm">{t('common.loading')}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{collections.length} collections</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-gray-800">
          + {t('admin.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Nom FR *</label>
              <input type="text" value={form.nameFr} onChange={(e) => setForm((prev) => ({ ...prev, nameFr: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Nom AR *</label>
              <input type="text" value={form.nameAr} onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Image</label>
              <input type="url" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">{editing ? t('admin.save') : t('admin.add')}</button>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:underline">{t('admin.cancel')}</button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Nom FR</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Slug</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Actif</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.nameFr}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-600">{c.slug}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(c)} className="text-xs text-brand-gold hover:underline mr-3">{t('admin.edit')}</button>
                    <button onClick={() => handleDelete(c.id, c.nameFr)} className="text-xs text-red-500 hover:underline">{t('admin.delete')}</button>
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
