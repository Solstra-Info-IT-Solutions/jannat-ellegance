'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LayoutDashboard, Package, ShoppingBag, Star, Tags } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';

const links = [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }, { href: '/admin/products', label: 'Products', icon: Package }, { href: '/admin/featured', label: 'Featured', icon: Star }, { href: '/admin/categories', label: 'Categories', icon: Tags }, { href: '/admin/orders', label: 'Orders', icon: ShoppingBag }, { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 }];
export default function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, status } = useAuth(); const router = useRouter(); const pathname = usePathname();
  useEffect(() => { if (status !== 'loading' && user?.role !== 'admin') router.replace('/?unauthorized=1'); }, [router, status, user?.role]);
  if (status === 'loading' || user?.role !== 'admin') return <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">Checking staff access…</main>;
  return <main className="min-h-screen bg-[#fff8fa]"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><header className="mb-7 flex flex-col justify-between gap-5 rounded-3xl bg-maroon-950 px-6 py-6 text-white sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-pink-200">Jannat Elegance</p><h1 className="mt-1 font-serif text-3xl">{title}</h1></div><nav className="flex flex-wrap gap-2">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${pathname === href || (href !== '/admin' && pathname.startsWith(href)) ? 'bg-white text-maroon-950' : 'bg-white/10 text-white hover:bg-white/20'}`}><Icon size={14} />{label}</Link>)}</nav></header>{children}</div></main>;
}
