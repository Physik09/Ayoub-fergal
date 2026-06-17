'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Supplier = {
  id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  _count: { products: number };
};

export default function SupplierDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });

  useEffect(() => {
    paramsPromise.then((p) => {
      fetch(`/api/suppliers/${p.id}`)
        .then((r) => r.json())
        .then((data) => {
          setSupplier(data);
          setForm({
            name: data.name,
            contactPerson: data.contactPerson || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            notes: data.notes || '',
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [paramsPromise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const id = (await paramsPromise).id;
    const res = await fetch(`/api/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/admin/suppliers');
    } else {
      const err = await res.json();
      alert(err.error || 'Error saving supplier');
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">{t('common.loading')}</p>;
  if (!supplier) return <p className="text-gray-500 text-sm">{t('admin.noData')}</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/suppliers" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.edit')} — {supplier.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 p-6">
        <Input label="Nom *" required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
        <Input label="Contact" value={form.contactPerson} onChange={(e) => setForm((prev) => ({ ...prev, contactPerson: e.target.value }))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Téléphone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Adresse</label>
          <textarea value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} rows={3} className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} rows={3} className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none" />
        </div>
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" loading={saving}>{t('admin.save')}</Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/suppliers')}>{t('admin.cancel')}</Button>
        </div>
      </form>
    </div>
  );
}
