import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ar' ? 'الشروط والأحكام' : 'CGV';
  return { title };
}

export default async function CgvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = locale === 'ar' ? 'الشروط والأحكام' : 'CONDITIONS GÉNÉRALES DE VENTE';
  const content =
    locale === 'ar'
      ? 'هذه الشروط والأحكام تنظم العلاقة التعاقدية بين أيوب فرڭال وعملائه. بإتمام عملية الشراء، فإنك توافق على هذه الشروط. جميع المنتجات معروضة في المتجر عبر الإنترنت تخضع لتوفر المخزون. الأسعار محددة بالدرهم المغربي (MAD) وتشمل الضرائب.'
      : 'Les présentes conditions générales de vente régissent les relations contractuelles entre Ayoub Fergal et ses clients. En passant commande, vous acceptez ces conditions. Tous les produits présentés sur la boutique en ligne sont soumis à disponibilité de stock. Les prix sont indiqués en dirhams marocains (MAD) et incluent les taxes.';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{title}</h1>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
