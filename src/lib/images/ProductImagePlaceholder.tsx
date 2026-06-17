interface ProductImagePlaceholderProps {
  className?: string;
  size?: number;
}

export function ProductImagePlaceholder({
  className = '',
  size = 80,
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
      aria-label="Image non disponible"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="38" r="18" stroke="#9CA3AF" strokeWidth="2.5" fill="none" />
        <path
          d="M24 82 C24 62 38 50 50 50 C62 50 76 62 76 82"
          stroke="#9CA3AF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9CA3AF"
          fontFamily="Georgia, serif"
          fontSize="20"
          fontWeight="bold"
        >
          AF
        </text>
      </svg>
    </div>
  );
}
