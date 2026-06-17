'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function OrderTrackingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/commande');
  }, [router]);
  return null;
}
