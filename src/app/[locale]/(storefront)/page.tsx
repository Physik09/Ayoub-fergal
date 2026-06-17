import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('site.title'),
    description: t('site.description'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featuredProducts = await prisma.product.findMany({
    where: {
      featured: true,
      status: 'ACTIVE',
    },
    include: {
      category: true,
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <>
      <HeroBanner />
      <FeaturedProducts products={featuredProducts} locale={locale} />
      <MarqueeStrip />
      <CategoryShowcase categories={categories} />
      <MarqueeStrip />
      <NewsletterSignup />
    </>
  );
}
