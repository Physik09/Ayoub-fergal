'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AddToCartButtonProps {
  inStock: boolean;
  onAdd: () => void;
}

export function AddToCartButton({ inStock, onAdd }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!inStock) {
    return (
      <Button variant="outline" disabled className="w-full cursor-not-allowed">
        Rupture de stock
      </Button>
    );
  }

  return (
    <Button
      variant={added ? 'secondary' : 'primary'}
      className="w-full"
      onClick={handleClick}
    >
      {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
    </Button>
  );
}
