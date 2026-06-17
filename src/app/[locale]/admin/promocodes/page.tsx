'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';

type PromoCode = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
};

export default function AdminPromocodesPage() {
  const t = useTranslations();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: 0, minOrderAmount: 0, maxUses: '', expiresAt: '' });

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/promocodes?page=${page}&limit=20`);
    const data = await res.json();
    setCodes(data.promocodes || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const resetForm = () => {
    setForm({ code: '', type: 'PERCENTAGE', value: 0, minOrderAmount: 0, maxUses: '', expiresAt: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (c: PromoCode) => {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrderAmount: c.minOrderAmount,
      maxUses: c.maxUses?.toString() || '',
      expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '',
    });
    setEditing(c);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      value: form.value,
      minOrderAmount: form.minOrderAmount,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };
    const res = editing
      ? await fetch(`/api/promocodes/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/promocodes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); fetchCodes(); }
    else { const err = await res.json(); alert(err.error || 'Error'); }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`${t('admin.confirm')}: ${code} ?`)) return;
    await fetch(`/api/promocodes/${id}`, { method: 'DELETE' });
    fetchCodes();
  };

  const toggleActive = async (c: PromoCode) => {
    await fetch(`/api/promocodes/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...c, isActive: !c.isActive }),
    });
    fetchCodes();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.promocodes')}</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-brand-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">
          + {t('admin.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Code *</label>
              <input type="text" value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none">
                <option value="PERCENTAGE">%</option>
                <option value="FIXED">Fixe (DH)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Valeur *</label>
              <input type="number" step="0.01" value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Min. commande</label>
              <input type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm((prev) => ({ ...prev, minOrderAmount: parseFloat(e.target.value) || 0 }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Utilisations max</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Expire le</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">{editing ? t('admin.save') : t('admin.add')}</button>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:underline">{t('admin.cancel')}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : codes.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Code</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Type</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Valeur</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Min.</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Utilisé</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.status')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3 text-xs">{c.type === 'PERCENTAGE' ? '%' : 'DH'}</td>
                  <td className="px-4 py-3 text-right">{c.type === 'PERCENTAGE' ? `${c.value}%` : `${c.value} DH`}</td>
                  <td className="px-4 py-3 text-right">{c.minOrderAmount > 0 ? `${c.minOrderAmount} DH` : '—'}</td>
                  <td className="px-4 py-3 text-center">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(c)} className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(c)} className="text-xs text-brand-gold hover:underline mr-3">{t('admin.edit')}</button>
                    <button onClick={() => handleDelete(c.id, c.code)} className="text-xs text-red-500 hover:underline">{t('admin.delete')}</button>
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
