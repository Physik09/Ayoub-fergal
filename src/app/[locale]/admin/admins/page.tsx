'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';

type AdminUser = {
  id: string;
  role: 'SUPER_ADMIN' | 'STAFF';
  user: {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    createdAt: string;
  };
};

export default function AdminAdminsPage() {
  const t = useTranslations();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ userId: '', role: 'STAFF' });
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string | null }[]>([]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admins?page=${page}&limit=20`);
    const data = await res.json();
    setAdmins(data.admins || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setUsers(data.customers || []);
    setShowInvite(true);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inviteForm),
    });
    if (res.ok) {
      setShowInvite(false);
      setInviteForm({ userId: '', role: 'STAFF' });
      fetchAdmins();
    } else {
      const err = await res.json();
      alert(err.error || 'Error');
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Retirer ${name} des administrateurs ?`)) return;
    await fetch(`/api/admins/${id}`, { method: 'DELETE' });
    fetchAdmins();
  };

  const handleRoleChange = async (id: string, role: string) => {
    await fetch(`/api/admins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    fetchAdmins();
  };

  if (loading) return <p className="text-gray-500 text-sm">{t('common.loading')}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.admins')}</h1>
        <button onClick={fetchUsers} className="bg-brand-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
          + Inviter
        </button>
      </div>

      {showInvite && (
        <form onSubmit={handleInvite} className="mb-6 p-4 border border-gray-200 bg-gray-50 space-y-3 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Utilisateur *</label>
            <select
              value={inviteForm.userId}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, userId: e.target.value }))}
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
            >
              <option value="">Sélectionner...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name || u.email} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Rôle</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none"
            >
              <option value="STAFF">Staff</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-brand-black text-white px-4 py-2 text-xs uppercase tracking-wider">Inviter</button>
            <button type="button" onClick={() => setShowInvite(false)} className="text-xs text-gray-500 hover:underline">Annuler</button>
          </div>
        </form>
      )}

      {admins.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Email</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Rôle</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{a.user.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.user.email || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={a.role}
                      onChange={(e) => handleRoleChange(a.id, e.target.value)}
                      className="text-xs border border-gray-200 px-2 py-1 rounded outline-none"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(a.id, a.user.name || '')} className="text-xs text-red-500 hover:underline">
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
