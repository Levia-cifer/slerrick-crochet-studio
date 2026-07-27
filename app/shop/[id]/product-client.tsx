'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartContext';

export default function ProductClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [color, setColor] = useState<string | null>(product.colors?.[0] ?? null);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await addItem(product.id, color);
    setAdding(false);
  };

  return (
    <div>
      {product.colors && product.colors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  color === c ? 'bg-berry text-white border-berry' : 'border-plum/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={!product.in_stock || adding}
        className="mt-6 w-full bg-berry text-white py-3 rounded-xl2 font-semibold shadow-soft disabled:opacity-40"
      >
        {!product.in_stock ? 'Sold Out' : adding ? 'Adding…' : 'Add to Cart'}
      </button>
    </div>
  );
}
