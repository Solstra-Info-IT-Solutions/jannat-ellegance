'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Category = { _id: string; name: string; productCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
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

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError('Category name must contain at least 2 characters.');
    setSaving(true); setError('');
    try {
      const response = await fetch('/api/admin/categories', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create category');
      setName('');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create category');
    } finally {
      setSaving(false);
    }
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
      <form onSubmit={create} className="h-fit rounded-3xl border border-maroon-100 bg-white p-6">
        <h2 className="font-serif text-2xl text-maroon-950">New category</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">New categories appear automatically in the storefront category slider and category grid.</p>
        <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-maroon-900">Category name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} placeholder="e.g. Saree" className="mt-2 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><Plus size={15} />{saving ? 'Creating…' : 'Create category'}</button>
      </form>
      <section className="rounded-3xl border border-maroon-100 bg-white p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-serif text-2xl text-maroon-950">All categories</h2><p className="mt-1 text-sm text-gray-500">{categories.length} {categories.length === 1 ? 'category' : 'categories'}</p></div></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-2">{categories.map((category) => <article key={category._id} className="flex items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-pink-50/60 p-4"><div><p className="font-semibold text-maroon-950">{category.name}</p><p className="mt-1 text-xs text-gray-500">{category.productCount || 0} live product{category.productCount === 1 ? '' : 's'}</p></div><button type="button" onClick={() => void remove(category)} className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-white px-3 py-2 text-xs font-bold text-maroon-850 transition hover:bg-pink-100"><Trash2 size={14} />Delete</button></article>)}</div>{!categories.length && <p className="py-10 text-center text-sm text-gray-500">No categories yet.</p>}</section>
    </div>
  </AdminShell>;
}
