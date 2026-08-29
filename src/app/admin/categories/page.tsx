'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Category = { _id: string; name: string; imageUrl?: string; productCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editName, setEditName] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const response = await fetch('/api/admin/categories', { credentials: 'include', cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load categories');
      setCategories(data.categories || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load categories');
    }
  };

  useEffect(() => { void load(); }, []);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, destination: 'new' | 'edit') => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    const body = new FormData(); body.append('images', file);
    try {
      const response = await fetch('/api/admin/uploads/images', { method: 'POST', credentials: 'include', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Image upload failed');
      const uploadedUrl = data.images?.[0]?.url;
      if (!uploadedUrl) throw new Error('Image upload failed');
      destination === 'new' ? setImageUrl(uploadedUrl) : setEditImageUrl(uploadedUrl);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Image upload failed');
    } finally {
      setUploading(false); event.target.value = '';
    }
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError('Category name must contain at least 2 characters.');
    setSaving(true); setError('');
    try {
      const response = await fetch('/api/admin/categories', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), imageUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create category');
      setName(''); setImageUrl(''); await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create category');
    } finally { setSaving(false); }
  };

  const beginEdit = (category: Category) => { setEditingId(category._id); setEditName(category.name); setEditImageUrl(category.imageUrl || ''); setError(''); };
  const saveEdit = async (category: Category) => {
    if (editName.trim().length < 2) return setError('Category name must contain at least 2 characters.');
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/admin/categories/${category._id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName.trim(), imageUrl: editImageUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update category');
      setCategories((items) => items.map((item) => item._id === category._id ? { ...item, ...data.category } : item));
      setEditingId('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update category');
    } finally { setSaving(false); }
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`Delete “${category.name}”? Categories with products cannot be deleted.`)) return;
    setError('');
    const response = await fetch(`/api/admin/categories/${category._id}`, { method: 'DELETE', credentials: 'include' });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Could not delete category');
    setCategories((items) => items.filter((item) => item._id !== category._id));
  };

  return <AdminShell title="Category Management">
    <div className="grid gap-7 lg:grid-cols-[360px_1fr]">
      <form onSubmit={create} className="h-fit rounded-3xl border border-maroon-100 bg-white p-6"><h2 className="font-serif text-2xl text-maroon-950">New category</h2><p className="mt-2 text-sm leading-6 text-gray-500">It will appear on the storefront as soon as it is created.</p><label className="mt-5 block text-xs font-bold uppercase tracking-wider text-maroon-900">Category name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} placeholder="e.g. Saree" className="mt-2 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-maroon-300 bg-maroon-50 p-4 text-sm font-bold text-maroon-800"><ImagePlus size={17} />{uploading ? 'Uploading…' : 'Add category image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void uploadImage(event, 'new')} className="hidden" /></label>{imageUrl && <div className="relative mt-3 overflow-hidden rounded-xl border border-maroon-100"><img src={imageUrl} alt="Category preview" className="aspect-square w-full object-cover" /><button type="button" onClick={() => setImageUrl('')} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-maroon-850" aria-label="Remove category image"><X size={15} /></button></div>}<button disabled={saving || uploading} className="mt-5 inline-flex items-center gap-2 rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><Plus size={15} />{saving ? 'Creating…' : 'Create category'}</button></form>
      <section className="rounded-3xl border border-maroon-100 bg-white p-6"><div><h2 className="font-serif text-2xl text-maroon-950">All categories</h2><p className="mt-1 text-sm text-gray-500">Edit the name or image of every category, including the original default categories.</p></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-5 grid gap-4 sm:grid-cols-2">{categories.map((category) => <article key={category._id} className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/60">{editingId === category._id ? <div className="p-4"><label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">Name<input value={editName} onChange={(event) => setEditName(event.target.value)} className="mt-2 w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm font-normal" /></label><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-maroon-300 bg-white p-3 text-xs font-bold text-maroon-800"><ImagePlus size={15} />{uploading ? 'Uploading…' : 'Replace image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void uploadImage(event, 'edit')} className="hidden" /></label>{editImageUrl && <div className="relative mt-3 overflow-hidden rounded-xl"><img src={editImageUrl} alt="Category preview" className="aspect-square w-full object-cover" /><button type="button" onClick={() => setEditImageUrl('')} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-maroon-850" aria-label="Remove category image"><X size={15} /></button></div>}<div className="mt-4 flex gap-2"><button type="button" disabled={saving || uploading} onClick={() => void saveEdit(category)} className="rounded-lg bg-maroon-800 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Save changes</button><button type="button" onClick={() => setEditingId('')} className="rounded-lg border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-maroon-850">Cancel</button></div></div> : <><div className="relative aspect-square bg-white"><img src={category.imageUrl || '/images/logo.jpeg'} alt={category.name} className="h-full w-full object-cover object-top" /></div><div className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-semibold text-maroon-950">{category.name}</p><p className="mt-1 text-xs text-gray-500">{category.productCount || 0} live product{category.productCount === 1 ? '' : 's'}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => beginEdit(category)} className="rounded-lg border border-pink-200 bg-white p-2 text-maroon-850" aria-label={`Edit ${category.name}`}><Pencil size={14} /></button><button type="button" onClick={() => void remove(category)} className="rounded-lg border border-pink-200 bg-white p-2 text-maroon-850" aria-label={`Delete ${category.name}`}><Trash2 size={14} /></button></div></div></>}</article>)}</div>{!categories.length && <p className="py-10 text-center text-sm text-gray-500">No categories yet.</p>}</section>
    </div>
  </AdminShell>;
}
