'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
Heart,
House,
LayoutDashboard,
Menu,
Package,
Search,
ShoppingBag,
User,
X,
LogOut,
UserPlus,
LogIn,
Sparkles,
ChevronDown,
ArrowRight,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthProvider';

const Navbar: React.FC = () => {
const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

const [menuOpen, setMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

const { user, status, logout } = useAuth();

const dropdownRef = useRef<HTMLDivElement>(null);

const { cartCount, wishlist, setCartDrawerOpen } = useCart();

useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (
dropdownRef.current &&
!dropdownRef.current.contains(event.target as Node)
) {
setAuthDropdownOpen(false);
}
};


document.addEventListener('mousedown', handleClickOutside);

return () => {
  document.removeEventListener('mousedown', handleClickOutside);
};


}, []);

useEffect(() => {
const q = searchParams.get('search');


if (q) {
  setSearchQuery(q);
}

}, [searchParams]);

const handleSearchSubmit = (e: React.FormEvent) => {
e.preventDefault();


if (!searchQuery.trim()) return;

router.push(
  `/shop?search=${encodeURIComponent(searchQuery.trim())}`
);

setSearchOpen(false);


};

const isActive = (href: string) => {
if (href === '/') {
return pathname === '/';
}


return pathname === href;

};

const navLinks = [
{
label: 'Home',
href: '/',
},
{
label: 'Shop',
href: '/shop',
},
{
label: 'About',
href: '/about',
},
{
label: 'Contact',
href: '/contact-us',
},
];

return ( <header className="sticky top-0 z-50 w-full border-b border-pink-100/80 bg-[#fff8fa]/95 shadow-[0_8px_30px_rgba(76,5,25,0.06)] backdrop-blur-xl">

  {/* Top Decorative Line */}
  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent" />

  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <div className="flex h-[78px] items-center justify-between gap-3 lg:h-[86px]">

      {/* Mobile Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="group grid h-11 w-11 flex-none place-items-center rounded-2xl border border-pink-200 bg-white text-maroon-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-50 hover:shadow-md lg:hidden"
        aria-label="Toggle Menu"
      >
        {menuOpen ? (
          <X
            size={23}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        ) : (
          <Menu size={23} />
        )}
      </button>

      {/* Brand */}
      <Link
        href="/"
        className="group relative flex items-center gap-3 sm:gap-4"
      >
        {/* Logo Glow */}
        <div className="absolute left-0 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-pink-300/30 blur-xl transition duration-500 group-hover:bg-pink-400/50" />

        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-full border-2 border-pink-300 bg-white shadow-lg shadow-pink-200/40 transition-all duration-500 group-hover:scale-105 group-hover:border-rose-400 sm:h-[58px] sm:w-[58px]">
          <Image
            src="/images/logo.jpeg"
            alt="Jannat Elegance Logo"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative flex flex-col leading-none">

          <div className="flex items-center gap-2">
            <span className="font-serif text-[21px] font-bold tracking-[0.16em] text-maroon-950 transition-colors duration-300 group-hover:text-rose-700 sm:text-[27px]">
              JANNAT
            </span>

            <Sparkles
              size={14}
              className="hidden text-pink-500 transition-transform duration-500 group-hover:rotate-12 sm:block"
            />
          </div>

          <span className="mt-1 text-[14px] font-bold uppercase tracking-[0.42em] text-pink-600 sm:text-[12px]">
            Elegance
          </span>

        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center rounded-full border border-pink-100 bg-white/80 p-1.5 shadow-sm lg:flex">

        {navLinks.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-rose-800 to-pink-600 text-white shadow-md shadow-pink-200'
                  : 'text-maroon-800 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {link.label}
            </Link>
          );
        })}

      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">

        {/* Search */}
        <button
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
          className={`group grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 sm:h-11 sm:w-11 ${
            searchOpen
              ? 'border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-200'
              : 'border-pink-200 bg-white text-maroon-900 shadow-sm hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-50'
          }`}
          aria-label="Search"
        >
          {searchOpen ? (
            <X size={20} />
          ) : (
            <Search
              size={20}
              className="transition-transform group-hover:scale-110"
            />
          )}
        </button>

        {/* Wishlist */}
        <Link
          href="/shop?wishlist=true"
          className="relative hidden h-11 w-11 place-items-center rounded-full border border-pink-200 bg-white text-pink-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-50 sm:grid"
          aria-label="Wishlist"
        >
          <Heart
            size={20}
            className="transition-transform duration-300 hover:scale-110"
          />

          {wishlist.length > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#fff8fa] bg-gradient-to-br from-rose-600 to-pink-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {wishlist.length > 99 ? '99+' : wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-maroon-950 via-rose-900 to-rose-700 text-white shadow-lg shadow-rose-300/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl sm:h-11 sm:w-11"
          aria-label="Cart"
        >
          <ShoppingBag size={20} />

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#fff8fa] bg-pink-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div
          ref={dropdownRef}
          className="relative hidden sm:block"
        >
          <button
            onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
            className={`flex h-11 items-center justify-center gap-1 rounded-full border px-3 transition-all duration-300 ${
              authDropdownOpen
                ? 'border-pink-400 bg-pink-50 text-pink-600'
                : 'border-pink-200 bg-white text-maroon-900 shadow-sm hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-50'
            }`}
            aria-label="Account"
          >
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100">
              <User size={16} />
            </div>

            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                authDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Account Dropdown */}
          {authDropdownOpen && (
            <div className="absolute right-0 mt-4 w-[300px] overflow-hidden rounded-[1.5rem] border border-pink-100 bg-white shadow-2xl shadow-rose-950/15 animate-fadeUp">

              {/* Decorative Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-maroon-950 via-rose-900 to-pink-700 px-5 py-5 text-white">

                <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full bg-pink-300/20 blur-2xl" />

                <div className="relative">

                  {status !== 'authenticated' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Sparkles size={17} className="text-pink-200" />

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-100">
                          Welcome
                        </p>
                      </div>

                      <h3 className="mt-2 font-serif text-2xl">
                        Jannat Elegance
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-pink-100/80">
                        Sign in to manage your orders and wishlist.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-pink-100/70">
                        Welcome back,
                      </p>

                      <h3 className="mt-1 truncate font-serif text-xl">
                        {user?.name || 'Beautiful Queen'} 👑
                      </h3>

                      <p className="mt-1 truncate text-xs text-pink-100/70">
                        {user?.email}
                      </p>
                    </>
                  )}

                </div>

              </div>

              {/* Logged Out */}
              {status !== 'authenticated' ? (
                <div className="space-y-3 p-4">

                  <Link
                    href="/login"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-maroon-900 transition hover:border-pink-400 hover:bg-pink-100"
                  >
                    <LogIn size={15} />
                    Log In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-pink-200 transition hover:scale-[1.02]"
                  >
                    <UserPlus size={15} />
                    Create Account
                  </Link>

                </div>
              ) : (
                <div className="p-3">

                  <div className="space-y-1">

                    <Link
                      href="/profile"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-maroon-900 transition hover:bg-pink-50"
                    >
                      <User
                        size={17}
                        className="text-pink-600"
                      />
                      My Profile
                      <ArrowRight
                        size={15}
                        className="ml-auto text-pink-300"
                      />
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-maroon-900 transition hover:bg-pink-50"
                    >
                      <Package
                        size={17}
                        className="text-pink-600"
                      />
                      My Orders
                      <ArrowRight
                        size={15}
                        className="ml-auto text-pink-300"
                      />
                    </Link>

                    {/* Track Order is temporarily hidden until its API flow is revisited.
                    <Link
                      href="/track-order"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-maroon-900 transition hover:bg-pink-50"
                    >
                      <ShoppingBag
                        size={17}
                        className="text-pink-600"
                      />
                      Track My Order
                      <ArrowRight
                        size={15}
                        className="ml-auto text-pink-300"
                      />
                    </Link> */}

                    <Link
                      href="/shop?wishlist=true"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-maroon-900 transition hover:bg-pink-50"
                    >
                      <Heart
                        size={17}
                        className="text-pink-600"
                      />
                      My Wishlist

                      {wishlist.length > 0 && (
                        <span className="ml-auto rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-maroon-900 transition hover:bg-pink-50"
                      >
                        <LayoutDashboard
                          size={17}
                          className="text-pink-600"
                        />
                        Admin Console
                        <ArrowRight
                          size={15}
                          className="ml-auto text-pink-300"
                        />
                      </Link>
                    )}

                  </div>

                  <div className="my-2 border-t border-pink-100" />

                  <button
                    onClick={() => {
                      setAuthDropdownOpen(false);
                      void logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    <LogOut size={17} />
                    Log Out
                  </button>

                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>

    {/* Search Panel */}
    {searchOpen && (
      <div className="border-t border-pink-100 py-5 animate-fadeUp">

        <form
          onSubmit={handleSearchSubmit}
          className="relative mx-auto max-w-3xl"
        >

          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 opacity-60 blur-md" />

          <div className="relative flex items-center rounded-full border border-pink-200 bg-white p-1.5 shadow-lg shadow-pink-100">

            <Search
              size={19}
              className="ml-4 text-pink-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Shararas, Gararas, Gowns, Lehengas..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-maroon-950 outline-none placeholder:text-gray-400"
              autoFocus
            />

            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-rose-800 to-pink-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:scale-105"
            >
              Search
            </button>

          </div>

        </form>

      </div>
    )}

    {/* Mobile Menu */}
    {menuOpen && (
      <div className="border-t border-pink-100 pb-5 pt-4 animate-fadeUp lg:hidden">

        <nav
          className="space-y-2"
          aria-label="Mobile navigation"
        >

          <Link
            onClick={() => setMenuOpen(false)}
            href="/"
            className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm transition hover:bg-pink-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <House size={19} />
            </div>

            Home
          </Link>

          <Link
            onClick={() => setMenuOpen(false)}
            href="/shop"
            className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm transition hover:bg-pink-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <ShoppingBag size={19} />
            </div>

            Shop Collection
          </Link>

          <Link
            onClick={() => setMenuOpen(false)}
            href="/shop?wishlist=true"
            className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm transition hover:bg-pink-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <Heart size={19} />
            </div>

            My Wishlist

            {wishlist.length > 0 && (
              <span className="ml-auto rounded-full bg-gradient-to-r from-rose-700 to-pink-600 px-3 py-1 text-xs font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            onClick={() => setMenuOpen(false)}
            href="/#about"
            className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm transition hover:bg-pink-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <Sparkles size={19} />
            </div>

            About Jannat
          </Link>

          <Link
            onClick={() => setMenuOpen(false)}
            href="/contact-us"
            className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm transition hover:bg-pink-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <User size={19} />
            </div>

            Contact Us
          </Link>

          <div className="my-3 border-t border-pink-100" />

          {status !== 'authenticated' ? (
            <div className="grid grid-cols-2 gap-3">

              <Link
                onClick={() => setMenuOpen(false)}
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-maroon-900"
              >
                <LogIn size={15} />
                Login
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                <UserPlus size={15} />
                Sign Up
              </Link>

            </div>
          ) : (
            <>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/profile"
                className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm"
              >
                <User size={20} className="text-pink-600" />
                My Profile
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/orders"
                className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm"
              >
                <Package size={20} className="text-pink-600" />
                My Orders
              </Link>

              {/* Track Order is temporarily hidden until its API flow is revisited.
              <Link
                onClick={() => setMenuOpen(false)}
                href="/track-order"
                className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm"
              >
                <ShoppingBag size={20} className="text-pink-600" />
                Track My Order
              </Link> */}

              {user?.role === 'admin' && (
                <Link
                  onClick={() => setMenuOpen(false)}
                  href="/admin"
                  className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white px-4 py-4 text-sm font-bold text-maroon-950 shadow-sm"
                >
                  <LayoutDashboard
                    size={20}
                    className="text-pink-600"
                  />
                  Admin Console
                </Link>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-left text-sm font-bold text-rose-700"
              >
                <LogOut size={20} />
                Log Out
              </button>

            </>
          )}

        </nav>

      </div>
    )}

  </div>
</header>

);
};

export default Navbar;
