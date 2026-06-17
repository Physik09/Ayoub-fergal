'use client';

import { useState } from 'react';
import { ProductImagePlaceholder } from '@/lib/images/ProductImagePlaceholder';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded overflow-hidden">
        <ProductImagePlaceholder className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden">
        <img
          src={images[selected]}
          alt={`${productName} - Image ${selected + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(idx)}
              className={`w-16 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                idx === selected ? 'border-brand-gold' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
