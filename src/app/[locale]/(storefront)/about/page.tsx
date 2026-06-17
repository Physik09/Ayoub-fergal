import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ar' ? 'حول' : 'À Propos';
  return { title };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = locale === 'ar' ? 'حول' : 'À PROPOS';
  const content =
    locale === 'ar'
      ? 'أيوب فرڭال هي علامة تجارية للملابس الرجالية مقرها المغرب. نختار أفضل قطع الأزياء الحضرية لنقدم لك الأناقة والجودة بأفضل الأسعار.'
      : 'Ayoub Fergal est une marque de vêtements homme basée au Maroc. Nous sélectionnons les meilleures pièces streetwear pour vous offrir style et qualité au meilleur prix.';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{title}</h1>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
