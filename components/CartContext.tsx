'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  color: string | null;
  image: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  subtotal: number;
  loading: boolean;
  addItem: (productId: string, color: string | null) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('cart_items')
      .select('id, product_id, color, quantity, products(name, price, images)')
      .eq('user_id', user.id);

    setItems(
      (data ?? []).map((row: any) => ({
        id: row.id,
        product_id: row.product_id,
        name: row.products?.name ?? 'Product',
        price: row.products?.price ?? 0,
        color: row.color,
        image: row.products?.images?.[0] ?? null,
        quantity: row.quantity,
      }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId: string, color: string | null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/account/login?next=/shop';
      return;
    }
    await supabase
      .from('cart_items')
      .upsert(
        { user_id: user.id, product_id: productId, color, quantity: 1 },
        { onConflict: 'user_id,product_id,color', ignoreDuplicates: false }
      );
    await refresh();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(cartItemId);
    await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId);
    await refresh();
  };

  const removeItem = async (cartItemId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartItemId);
    await refresh();
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, subtotal, loading, addItem, updateQuantity, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
