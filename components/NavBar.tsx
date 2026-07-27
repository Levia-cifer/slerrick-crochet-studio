'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function NavBar() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-blush">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/monogram.png" alt="Slerrick" width={36} height={34} className="h-9 w-auto" />
          <span className="font-display text-xl font-semibold text-plum">Slerrick</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/shop" className="hover:text-berry">Shop</Link>
          <Link href="/account" className="hover:text-berry">Account</Link>
          <Link href="/cart" className="relative hover:text-berry">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-berry text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
