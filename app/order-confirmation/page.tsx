import Link from 'next/link';

export default function OrderConfirmationPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="px-4 py-20 text-center max-w-md mx-auto">
      <h1 className="font-display text-3xl font-semibold text-berry mb-2">Order Received! 🎉</h1>
      <p className="text-plum/70 mb-1">Your order number is</p>
      <p className="font-display text-xl font-semibold">{searchParams.order}</p>
      <p className="text-plum/70 mt-4 text-sm">
        We're verifying your payment now — you'll get a message once it's confirmed
        and your order is on its way.
      </p>
      <Link href="/shop" className="inline-block mt-8 text-berry font-semibold">
        Continue Shopping →
      </Link>
    </div>
  );
}
