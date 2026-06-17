'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';

type Supplier = {
  id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  _count: { products: number };
};

export default function AdminSuppliersPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/suppliers?page=${page}&limit=20`);
    const data = await res.json();
    setSuppliers(data.suppliers || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const resetForm = () => {
    setForm({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (s: Supplier) => {
    setForm({
      name: s.name,
      contactPerson: s.contactPerson || '',
      phone: s.phone || '',
      email: s.email || '',
      address: '',
      notes: '',
    });
    setEditing(s);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form };
    const res = editing
      ? await fetch(`/api/suppliers/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      resetForm();
      fetchSuppliers();
    } else {
      const err = await res.json();
      alert(err.error || 'Error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t('admin.confirm')}: ${name} ?`)) return;
    await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.suppliers')}</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-brand-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          + {t('admin.add')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-lg">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Nom *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Contact</label>
              <input type="text" value={form.contactPerson} onChange={(e) => setForm((prev) => ({ ...prev, contactPerson: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Téléphone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">
              {editing ? t('admin.save') : t('admin.add')}
            </button>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:underline">{t('admin.cancel')}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : suppliers.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Nom</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Tél</th>
                  <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Produits</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.contactPerson || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                    <td className="px-4 py-3 text-center">{s._count.products}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(s)} className="text-xs text-brand-gold hover:underline mr-3">{t('admin.edit')}</button>
                      <button onClick={() => handleDelete(s.id, s.name)} className="text-xs text-red-500 hover:underline">{t('admin.delete')}</button>
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
