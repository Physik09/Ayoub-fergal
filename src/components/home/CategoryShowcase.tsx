import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

type Category = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
};

type Props = {
  categories: Category[];
};

export function CategoryShowcase({ categories }: Props) {
  const t = useTranslations();

  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase mb-10 text-center md:text-left">
          {t('categories.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group flex items-center justify-between py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase group-hover:text-brand-gold transition-colors">
                  {cat.nameFr}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-400 group-hover:text-brand-gold transition-colors"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
          <div className="aspect-[4/3] bg-gray-200 rounded overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-sm uppercase tracking-wider">
              Photo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
