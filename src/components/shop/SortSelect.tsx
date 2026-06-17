'use client';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 px-3 py-1.5 text-sm outline-none"
    >
      <option value="newest">Nouveautés</option>
      <option value="price_asc">Prix ↑</option>
      <option value="price_desc">Prix ↓</option>
      <option value="oldest">Anciens</option>
    </select>
  );
}
