'use client';

import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();

  if (loading) return <p className="p-6 text-center text-plum/50">Loading cart…</p>;

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-plum/60 mb-4">Your cart is empty.</p>
        <Link href="/shop" className="text-berry font-semibold">Browse the shop →</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 bg-white rounded-xl2 shadow-soft p-3">
            <div className="w-20 h-20 bg-blush rounded-lg shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              {item.color && <p className="text-xs text-plum/50">{item.color}</p>}
              <p className="text-berry font-semibold text-sm mt-1">GH₵{item.price.toFixed(2)}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-plum/20 text-sm"
                >−</button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-plum/20 text-sm"
                >+</button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-xs text-plum/40 underline"
                >Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center font-semibold">
        <span>Subtotal</span>
        <span className="text-berry text-lg">GH₵{subtotal.toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block w-full text-center bg-berry text-white py-3 rounded-xl2 font-semibold shadow-soft"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
