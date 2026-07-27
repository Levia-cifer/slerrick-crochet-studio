import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  let query = supabase.from('products').select('*, categories(slug)').order('created_at', { ascending: false });
  if (searchParams.category) {
    const cat = categories?.find((c) => c.slug === searchParams.category);
    if (cat) query = query.eq('category_id', cat.id);
  }
  const { data: products } = await query;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-semibold mb-6">Shop</h1>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4">
        <Link
          href="/shop"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
            !searchParams.category ? 'bg-berry text-white border-berry' : 'border-plum/15'
          }`}
        >
          All
        </Link>
        {categories?.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
              searchParams.category === c.slug ? 'bg-berry text-white border-berry' : 'border-plum/15'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-plum/60 text-sm">
          Nothing here yet — new pieces are being listed soon. Check back!
        </p>
      )}
    </div>
  );
}
