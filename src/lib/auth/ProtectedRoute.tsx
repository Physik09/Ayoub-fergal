'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminCheck, setAdminCheck] = useState<{ done: boolean; isAdmin: boolean }>({ done: false, isAdmin: false });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!adminOnly || !user) return;
    fetch('/api/admins/me')
      .then((r) => r.json())
      .then((data) => setAdminCheck({ done: true, isAdmin: data.isAdmin }))
      .catch(() => setAdminCheck({ done: true, isAdmin: false }));
  }, [adminOnly, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (adminOnly) {
    if (!adminCheck.done) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      );
    }
    if (!adminCheck.isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500 text-sm">Accès non autorisé</div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
