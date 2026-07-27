import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0];
  return (
    <Link
      href={`/shop/${product.id}`}
      className="block bg-white rounded-xl2 shadow-soft overflow-hidden hover:-translate-y-1 transition"
    >
      <div className="aspect-square bg-blush relative">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-plum/30 text-sm">
            No image yet
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute top-2 left-2 bg-plum/80 text-white text-xs px-2 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <p className="text-berry font-semibold text-sm mt-1">
          GH₵{Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
