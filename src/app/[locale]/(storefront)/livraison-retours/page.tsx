import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ar' ? 'التوصيل والإرجاع' : 'Livraison & Retours';
  return { title };
}

export default async function LivraisonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = locale === 'ar' ? 'التوصيل والإرجاع' : 'LIVRAISON & RETOURS';
  const content =
    locale === 'ar'
      ? 'نوصل إلى جميع المدن الكبرى في المغرب. مدة التوصيل تتراوح بين 2 و 7 أيام عمل حسب منطقتك. يُقبل الإرجاع خلال 14 يومًا من استلام الطلب. يجب أن تكون المنتجات في حالتها الأصلية مع الملصقات.'
      : 'Nous livrons dans toutes les grandes villes du Maroc. Les délais de livraison varient de 2 à 7 jours ouvrés selon votre région. Les retours sont acceptés sous 14 jours suivant la réception de votre commande. Les articles doivent être dans leur état d\'origine avec les étiquettes.';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{title}</h1>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
