'use client';

type SizeEntry = {
  size: string | null;
  stock: number;
};

interface SizeSelectorProps {
  sizes: string[];
  variants: SizeEntry[];
  selectedSize: string | null;
  selectedColor?: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({
  sizes,
  variants,
  selectedSize,
  selectedColor,
  onSelect,
}: SizeSelectorProps) {
  const getVariant = (size: string) =>
    variants.find(
      (v) => v.size === size && (!selectedColor || true)
    );

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const variant = getVariant(size);
        const disabled = !variant || variant.stock === 0;
        return (
          <button
            key={size}
            type="button"
            onClick={() => !disabled && onSelect(size)}
            disabled={disabled}
            className={`px-4 py-2 text-sm border transition-colors ${
              selectedSize === size
                ? 'border-brand-black bg-brand-black text-white'
                : disabled
                ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                : 'border-gray-300 hover:border-brand-black'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
