import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductClient from './product-client';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();
  if (!product) return notFound();

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="aspect-square bg-blush rounded-xl2 overflow-hidden relative">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-plum/30">No image yet</div>
        )}
      </div>
      <h1 className="font-display text-2xl font-semibold mt-6">{product.name}</h1>
      <p className="text-berry text-xl font-semibold mt-1">GH₵{Number(product.price).toFixed(2)}</p>
      <p className="text-plum/70 mt-4 text-sm leading-relaxed">{product.description}</p>
      <ProductClient product={product} />
    </div>
  );
}
