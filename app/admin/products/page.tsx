import { requireAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/server';
import { createProduct, updateProductStock, deleteProduct } from './actions';

export default async function AdminProductsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: products } = await admin.from('products').select('*, categories(name)').order('created_at', { ascending: false });
  const { data: categories } = await admin.from('categories').select('*').order('name');

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Manage Products</h1>

      <form action={createProduct} className="bg-white rounded-xl2 shadow-soft p-4 space-y-3 mb-8">
        <p className="font-semibold text-sm">Add a New Product</p>
        <input name="name" required placeholder="Product Name" className="input" />
        <textarea name="description" placeholder="Description" className="input" rows={2} />
        <input name="price" required type="number" step="0.01" placeholder="Price (GH₵)" className="input" />
        <select name="category_id" className="input">
          <option value="">No category</option>
          {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="colors" placeholder="Colors, comma separated (e.g. Cream, Rose, Sage)" className="input" />
        <input name="images" placeholder="Image URLs, comma separated (upload to Supabase Storage first)" className="input" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="in_stock" defaultChecked /> In Stock
        </label>
        <button className="w-full bg-berry text-white py-2.5 rounded-xl2 font-semibold">Add Product</button>
      </form>

      <div className="space-y-3">
        {products?.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl2 shadow-soft p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-plum/50">{p.categories?.name ?? 'Uncategorized'} · GH₵{Number(p.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <form action={updateProductStock.bind(null, p.id, !p.in_stock)}>
                <button className={`text-xs px-2 py-1 rounded-full ${p.in_stock ? 'bg-sage/30' : 'bg-plum/10'}`}>
                  {p.in_stock ? 'In Stock' : 'Sold Out'}
                </button>
              </form>
              <form action={deleteProduct.bind(null, p.id)}>
                <button className="text-xs text-berry-dark underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
