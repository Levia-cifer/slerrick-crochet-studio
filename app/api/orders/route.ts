import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Please log in first.' }, { status: 401 });
  }

  const body = await request.json();
  const {
    fullName, phoneNumber, whatsappNumber, region, town,
    exactLocation, landmark, deliveryNotes,
    paymentReference, payerNumber, payerName,
  } = body;

  // Pull the user's current cart to build order line items server-side
  // (never trust prices/quantities sent from the client).
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('quantity, color, products(id, name, price)')
    .eq('user_id', user.id);

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }

  const subtotal = cartItems.reduce(
    (sum: number, i: any) => sum + i.products.price * i.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      full_name: fullName,
      phone_number: phoneNumber,
      whatsapp_number: whatsappNumber || null,
      region, town,
      exact_location: exactLocation,
      landmark: landmark || null,
      delivery_notes: deliveryNotes || null,
      payment_reference: paymentReference,
      payer_number: payerNumber,
      payer_name: payerName,
      subtotal,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Could not create order.' }, { status: 500 });
  }

  const orderItems = cartItems.map((i: any) => ({
    order_id: order.id,
    product_id: i.products.id,
    product_name: i.products.name,
    color: i.color,
    unit_price: i.products.price,
    quantity: i.quantity,
  }));
  await supabase.from('order_items').insert(orderItems);

  // Clear the cart now that the order is placed
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  return NextResponse.json({ orderNumber: order.order_number });
}
