'use client';

type ColorEntry = {
  color: string | null;
  colorHex: string | null;
};

interface ColorSelectorProps {
  colors: string[];
  variants: ColorEntry[];
  selectedColor: string | null;
  onSelect: (color: string) => void;
}

export function ColorSelector({
  colors,
  variants,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  if (colors.length === 0) return null;

  const getVariant = (color: string) =>
    variants.find((v) => v.color === color);

  return (
    <div className="flex gap-2">
      {colors.map((color) => {
        const variant = getVariant(color);
        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? 'border-brand-gold scale-110'
                : 'border-gray-300 hover:border-gray-500'
            }`}
            style={{ backgroundColor: variant?.colorHex || '#000' }}
            title={color}
          />
        );
      })}
    </div>
  );
}
