'use client';

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
}

interface ShopFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  selectedSizes: string[];
  priceRange: { min: string; max: string };
  onToggleCategory: (id: string) => void;
  onToggleSize: (size: string) => void;
  onPriceChange: (range: { min: string; max: string }) => void;
  onReset: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function ShopFilters({
  categories,
  selectedCategories,
  selectedSizes,
  priceRange,
  onToggleCategory,
  onToggleSize,
  onPriceChange,
  onReset,
}: ShopFiltersProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <h2 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4">
        Filtres
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Catégorie</h3>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => onToggleCategory(cat.id)}
                className="accent-brand-gold"
              />
              <span className="text-sm text-gray-600">{cat.nameFr}</span>
            </label>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Taille</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onToggleSize(s)}
                className={`border px-3 py-1.5 text-xs transition-colors ${
                  selectedSizes.includes(s)
                    ? 'border-brand-black bg-brand-black text-white'
                    : 'border-gray-300 hover:border-brand-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Prix</h3>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
              className="w-full border border-gray-300 px-2 py-1.5 text-xs outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
              className="w-full border border-gray-300 px-2 py-1.5 text-xs outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-brand-gold hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </aside>
  );
}
