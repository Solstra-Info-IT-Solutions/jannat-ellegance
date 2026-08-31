'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Tags,
  MessageSquareQuote,
} from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';

const links = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/admin/featured',
    label: 'Featured',
    icon: Star,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Tags,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingBag,
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: MessageSquareQuote,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
];

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== 'loading' && user?.role !== 'admin') {
      router.replace('/?unauthorized=1');
    }
  }, [router, status, user?.role]);

  if (status === 'loading' || user?.role !== 'admin') {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">
        Checking staff access…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8fa]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        
        {/* ================= HEADER ================= */}

        <header className="mb-7 overflow-hidden rounded-[28px] bg-maroon-950 text-white shadow-xl">
          
          <div className="flex flex-col justify-between gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center">
            
            {/* Title */}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-200 sm:text-xs">
                Jannat Elegance
              </p>

              <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
                {title}
              </h1>
            </div>

            {/* Navigation */}

            <nav className="flex flex-wrap gap-2">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== '/admin' && pathname.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      flex items-center gap-2
                      rounded-full
                      px-3 py-2.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      transition-all
                      sm:px-4
                      sm:text-xs
                      ${
                        isActive
                          ? 'bg-[#fff8fa] text-maroon-950 shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }
                    `}
                  >
                    <Icon size={14} />

                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

          </div>
        </header>

        {children}

      </div>
    </main>
  );
}