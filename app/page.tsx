import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const supabase = createClient();
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div>
      {/* Hero — the dramatic brand moment */}
      <section className="bg-espresso px-4 py-14 text-center">
        <Image
          src="/hero-logo.png"
          alt="Slerrick — Handmade with love in Ghana"
          width={480}
          height={620}
          priority
          className="mx-auto w-full max-w-[280px] h-auto"
        />
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/shop"
            className="bg-berry text-cream px-6 py-3 rounded-xl2 font-semibold shadow-soft hover:bg-berry-dark transition"
          >
            Shop Now
          </Link>
          <a
            href="https://wa.me/233549402696"
            target="_blank"
            className="bg-transparent text-cream px-6 py-3 rounded-xl2 font-semibold border border-cream/30 hover:border-berry transition"
          >
            WhatsApp Us
          </a>
        </div>
      </section>

      <div className="scallop-divider-berry" />

      {/* New arrivals */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-semibold mb-6">New Arrivals</h2>
        {newArrivals && newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-plum/60 text-sm">
            New pieces are on the way — check back soon, or browse the full shop.
          </p>
        )}
      </section>
    </div>
  );
}
