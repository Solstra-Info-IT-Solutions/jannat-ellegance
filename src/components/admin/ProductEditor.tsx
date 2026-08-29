'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Plus, X } from 'lucide-react';
import AdminShell from './AdminShell';

type Category = { _id: string; name: string };
type SizeRow = { size: string; stock: number; price?: number };
type FormState = {
  name: string; description: string; categoryId: string; price: string; discount: string;
  discountType: string; isOnSale: boolean; isFeatured: boolean; isActive: boolean;
  status: string; sizes: SizeRow[]; imageUrls: string[]; metaTitle: string; metaDescription: string;
};

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const blank: FormState = {
  name: '', description: '', categoryId: '', price: '', discount: '0', discountType: 'percentage',
  isOnSale: false, isFeatured: false, isActive: true, status: 'draft', sizes: [{ size: 'M', stock: 0 }],
  imageUrls: [], metaTitle: '', metaDescription: '',
};

export default function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(blank);
  const [initialForm, setInitialForm] = useState<FormState | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const categoryResponse = await fetch('/api/admin/categories', { credentials: 'include' });
        if (!categoryResponse.ok) throw new Error('Unable to load categories');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.categories || []);

        if (!productId) {
          if (categoryData.categories?.[0]) setForm((current) => ({ ...current, categoryId: current.categoryId || categoryData.categories[0]._id }));
          return;
        }

        const productResponse = await fetch(`/api/admin/products/${productId}`, { credentials: 'include' });
        if (!productResponse.ok) throw new Error('Product not found');
        const productData = await productResponse.json();
        const product = productData.product;
        if (!product) throw new Error('Product not found');

        const loaded: FormState = {
          name: product.name || '', description: product.description || '', categoryId: product.categoryId || '',
          price: String(product.price ?? ''), discount: String(product.discount ?? 0),
          discountType: product.discountType || 'percentage', isOnSale: Boolean(product.isOnSale),
          isFeatured: Boolean(product.isFeatured), isActive: product.isActive !== false, status: product.status || 'draft',
          sizes: (product.sizes || []).map((item: SizeRow) => ({ size: item.size, stock: item.stock, ...(Number.isFinite(item.price) ? { price: item.price } : {}) })),
          imageUrls: [...(product.imageUrls || [])], metaTitle: product.metaTitle || '', metaDescription: product.metaDescription || '',
        };
        setForm(loaded);
        setInitialForm(loaded);
      } catch {
        setError(productId ? 'Unable to load this product for editing.' : 'Unable to load product details.');
      }
    };
    void load();
  }, [productId]);

  const addCategory = async () => {
    const name = window.prompt('New category name');
    if (!name?.trim()) return;
    const response = await fetch('/api/admin/categories', {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim() }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Could not add category');
    setCategories((items) => [...items, data.category].sort((a, b) => a.name.localeCompare(b.name)));
    setForm((current) => ({ ...current, categoryId: data.category._id }));
  };

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setUploading(true); setError('');
    const data = new FormData();
    Array.from(event.target.files).forEach((file) => data.append('images', file));
    try {
      const response = await fetch('/api/admin/uploads/images', { method: 'POST', credentials: 'include', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Image upload failed');
      setForm((current) => ({ ...current, imageUrls: [...current.imageUrls, ...result.images.map((image: { url: string }) => image.url)] }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Image upload failed');
    } finally {
      setUploading(false); event.target.value = '';
    }
  };

  const toggleSize = (size: string) => setForm((current) => ({
    ...current,
    sizes: current.sizes.some((item) => item.size === size)
      ? current.sizes.filter((item) => item.size !== size)
      : [...current.sizes, { size, stock: 0 }],
  }));
  const updateStock = (size: string, stock: number) => setForm((current) => ({ ...current, sizes: current.sizes.map((item) => item.size === size ? { ...item, stock: Math.max(0, stock) } : item) }));
  const updateSizePrice = (size: string, value: string) => setForm((current) => ({ ...current, sizes: current.sizes.map((item) => item.size === size ? { ...item, ...(value === '' ? { price: undefined } : { price: Math.max(0, Number(value)) }) } : item) }));

  const save = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    const price = Number(form.price); const discount = Number(form.discount);
    if (form.name.trim().length < 2) return setError('Product name must contain at least 2 characters.');
    if (form.description.trim().length < 10) return setError('Description must contain at least 10 characters.');
    if (!form.categoryId) return setError('Select or create a category.');
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(discount) || discount < 0) return setError('Enter valid product prices.');
    if (form.isOnSale && form.discountType === 'percentage' && discount > 100) return setError('Percentage discount cannot be more than 100%.');
    if (!form.sizes.length || !form.imageUrls.length) return setError('Select at least one size and upload at least one image.');
    if (form.sizes.some((item) => !allSizes.includes(item.size) || !Number.isInteger(item.stock) || item.stock < 0 || (item.price !== undefined && (!Number.isFinite(item.price) || item.price < 0)))) return setError('Each size needs valid stock and optional price.');

    const body = { ...form, name: form.name.trim(), description: form.description.trim(), price, discount, sizes: [...form.sizes].sort((a, b) => allSizes.indexOf(a.size) - allSizes.indexOf(b.size)) };
    const changedBody = productId && initialForm ? Object.fromEntries(Object.entries(body).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(initialForm[key as keyof FormState]))) : body;
    if (productId && !Object.keys(changedBody).length) return router.replace('/admin/products');

    setSaving(true);
    try {
      const response = await fetch(productId ? `/api/admin/products/${productId}` : '/api/admin/products', {
        method: productId ? 'PATCH' : 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changedBody),
      });
      const data = await response.json();
      if (!response.ok) return setError(data.error || 'Could not save product');
      router.replace('/admin/products');
    } catch {
      setError('Could not save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const finalPrice = Math.max(0, Number(form.price || 0) - (form.isOnSale ? form.discountType === 'percentage' ? Number(form.price || 0) * Number(form.discount || 0) / 100 : Number(form.discount || 0) : 0));

  return <AdminShell title={productId ? 'Edit Product' : 'New Product'}>
    <form onSubmit={save} className="grid gap-7 lg:grid-cols-[1fr_330px]">
      <section className="space-y-6 rounded-3xl border border-maroon-100 bg-white p-6 sm:p-8">
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="block text-xs font-bold uppercase text-maroon-900">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        <label className="block text-xs font-bold uppercase text-maroon-900">Description<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 min-h-32 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase text-maroon-900">Category<div className="mt-1.5 flex gap-2"><select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="min-w-0 flex-1 rounded-xl border border-maroon-100 p-3 text-sm font-normal"><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select><button type="button" onClick={addCategory} className="grid w-11 place-items-center rounded-xl bg-maroon-800 text-white" aria-label="Add category"><Plus size={17} /></button></div></label>
          <label className="text-xs font-bold uppercase text-maroon-900">Base price<input required min="0" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        </div>
        <div className="rounded-2xl bg-maroon-50 p-4"><label className="flex items-center gap-2 text-sm font-bold text-maroon-950"><input type="checkbox" checked={form.isOnSale} onChange={(event) => setForm({ ...form, isOnSale: event.target.checked })} />On sale</label>{form.isOnSale && <div className="mt-3 grid grid-cols-2 gap-3"><input min="0" type="number" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} className="rounded-xl border border-maroon-100 p-3 text-sm" /><select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })} className="rounded-xl border border-maroon-100 p-3 text-sm"><option value="percentage">Percent</option><option value="flat">Flat ₹</option></select></div>}<p className="mt-3 text-sm text-maroon-900">Base sale price: <strong>₹{finalPrice.toLocaleString('en-IN')}</strong></p></div>
        <div><p className="text-xs font-bold uppercase text-maroon-900">Sizes, stock and price</p><p className="mt-1 text-xs text-gray-500">Leave a size price blank to use the base price.</p><div className="mt-3 flex flex-wrap gap-2">{allSizes.map((size) => <button type="button" key={size} onClick={() => toggleSize(size)} className={`rounded-full border px-4 py-2 text-xs font-bold ${form.sizes.some((item) => item.size === size) ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-maroon-100 text-maroon-900'}`}>{size}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2">{form.sizes.map((item) => <div key={item.size} className="rounded-xl border border-maroon-100 p-3 text-sm"><div className="mb-2 flex items-center justify-between"><span className="font-bold text-maroon-950">{item.size}</span><label className="text-xs text-gray-500">Stock <input aria-label={`${item.size} stock`} type="number" min="0" value={item.stock} onChange={(event) => updateStock(item.size, Number(event.target.value))} className="ml-1 w-16 rounded-lg border border-maroon-100 p-2 text-right" /></label></div><label className="block text-xs text-gray-500">Price for {item.size}<input aria-label={`${item.size} price`} type="number" min="0" value={item.price ?? ''} onChange={(event) => updateSizePrice(item.size, event.target.value)} placeholder={`Base ₹${form.price || 0}`} className="mt-1 w-full rounded-lg border border-maroon-100 p-2 text-sm text-maroon-950" /></label></div>)}</div></div>
        <div><p className="text-xs font-bold uppercase text-maroon-900">Images</p><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-maroon-300 bg-maroon-50 p-6 text-sm font-bold text-maroon-800"><ImagePlus size={18} />{uploading ? 'Uploading…' : 'Upload JPG, PNG or WebP (max 5MB)'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadImages} className="hidden" disabled={uploading} /></label><div className="mt-3 grid grid-cols-3 gap-3">{form.imageUrls.map((url) => <div key={url} className="relative overflow-hidden rounded-xl border border-maroon-100"><img src={url} alt="Product" className="aspect-square w-full object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, imageUrls: current.imageUrls.filter((item) => item !== url) }))} className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-600" aria-label="Remove image"><X size={14} /></button></div>)}</div></div>
      </section>
      <aside className="h-fit space-y-5 rounded-3xl border border-maroon-100 bg-white p-6"><h2 className="font-serif text-2xl text-maroon-950">Publishing</h2><label className="flex items-center justify-between text-sm text-maroon-900"><span>Visibility</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border border-maroon-100 p-2"><option value="draft">Draft</option><option value="published">Published</option></select></label><label className="flex items-center gap-2 text-sm text-maroon-900"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />Active on storefront</label><label className="flex items-center gap-2 text-sm font-semibold text-maroon-900"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} />Feature on home page</label><p className="-mt-3 text-xs text-gray-500">Only active, published featured products are shown in Featured Masterpieces.</p><div className="border-t border-maroon-100 pt-5"><div className="flex items-center justify-between"><h3 className="font-serif text-lg text-maroon-950">Categories</h3><button type="button" onClick={() => router.push('/admin/categories')} className="rounded-lg bg-maroon-800 px-3 py-1.5 text-xs font-bold text-white">Manage</button></div><p className="mt-1 text-xs text-gray-500">Add or delete categories from the dedicated category page.</p></div><div className="border-t border-maroon-100 pt-5"><h3 className="font-serif text-lg text-maroon-950">SEO</h3><input value={form.metaTitle} maxLength={160} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} placeholder="Meta title" className="mt-3 w-full rounded-xl border border-maroon-100 p-3 text-sm" /><textarea value={form.metaDescription} maxLength={320} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} placeholder="Meta description" className="mt-3 min-h-24 w-full rounded-xl border border-maroon-100 p-3 text-sm" /></div><button disabled={saving || uploading} className="w-full rounded-full bg-maroon-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{saving ? 'Saving…' : productId ? 'Update product' : 'Create product'}</button></aside>
    </form>
  </AdminShell>;
}
