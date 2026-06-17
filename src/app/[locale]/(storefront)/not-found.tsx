import { Link } from '@/i18n/navigation';

type Props = {
  params?: Promise<{ locale: string }>;
};

export default async function NotFound({ params }: Props) {
  const locale = params ? (await params).locale : 'fr';
  const title = locale === 'ar' ? 'الصفحة غير موجودة' : 'Page introuvable';
  const desc = locale === 'ar'
    ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
    : 'La page que vous cherchez n\'existe pas ou a été déplacée.';
  const btn = locale === 'ar' ? 'العودة إلى الرئيسية' : 'Retour à l\'accueil';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold tracking-[0.15em] text-brand-gold mb-4">404</h1>
      <h2 className="text-xl font-bold tracking-[0.15em] uppercase mb-2">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{desc}</p>
      <Link href="/" className="bg-brand-black text-white px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
        {btn}
      </Link>
    </div>
  );
}
