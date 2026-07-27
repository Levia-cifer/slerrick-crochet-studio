'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/server';

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const colors = String(formData.get('colors') || '')
    .split(',').map((c) => c.trim()).filter(Boolean);
  const images = String(formData.get('images') || '')
    .split(',').map((c) => c.trim()).filter(Boolean);

  await admin.from('products').insert({
    name: formData.get('name'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    category_id: formData.get('category_id') || null,
    colors,
    images,
    in_stock: formData.get('in_stock') === 'on',
  });

  revalidatePath('/admin/products');
}

export async function updateProductStock(id: string, inStock: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('products').update({ in_stock: inStock }).eq('id', id);
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
}
