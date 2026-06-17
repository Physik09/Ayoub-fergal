import { setRequestLocale } from 'next-intl/server';
import AdminSidebar from '@/components/admin/Sidebar';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className={`flex-1 ${rtl ? 'mr-64' : 'ml-64'}`}>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
