'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  LogOut,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthProvider';

const Navbar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  // Active NextAuth Authentication State
  const { user, status, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { cartCount, wishlist, setCartDrawerOpen } = useCart();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search query from URL
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-maroon-200 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">

          {/* Left: Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden bg-maroon-950 text-white p-2 rounded-lg hover:bg-maroon-800 transition shadow-sm"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-maroon-200 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0 relative">
              <Image
                src="/images/logo.jpeg"
                alt="Jannat Elegance Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-maroon-950 group-hover:text-maroon-800 transition">
                JANNAT
              </span>
              <span className="text-[9px] tracking-[3px] font-medium text-pink-600 uppercase -mt-1 font-sans">
                Elegance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 rounded-full bg-pink-50 p-1.5 text-sm font-bold font-sans">
            <Link
              href="/"
              className="rounded-full border border-rose-300 bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-rose-600 hover:to-pink-700 hover:shadow-lg"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-fuchsia-300 bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 py-2 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-fuchsia-700 hover:to-purple-800 hover:shadow-lg"
            >
              Shop
            </Link>

            <Link
              href="/shop?category=Frock Suit"
              className="rounded-full border border-amber-300 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700 hover:shadow-lg"
            >
              Frocks
            </Link>

            <Link
              href="/shop?category=Sharara Suit"
              className="rounded-full border border-violet-300 bg-gradient-to-r from-violet-600 to-indigo-700 px-4 py-2 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-800 hover:shadow-lg"
            >
              Shararas
            </Link>

            <Link
              href="/#about"
              className="rounded-full border border-teal-300 bg-gradient-to-r from-teal-600 to-cyan-700 px-4 py-2 text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-800 hover:shadow-lg"
            >
              About
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-maroon-950">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full bg-amber-100 border border-amber-200 hover:bg-amber-200 text-amber-950 transition shadow-sm"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/shop?wishlist=true"
              className="relative p-2.5 rounded-full bg-pink-100 border border-pink-200 hover:bg-pink-200 text-pink-850 transition hidden sm:block shadow-sm"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-maroon-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-maroon-850 hover:bg-maroon-950 text-white transition shadow-md"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-maroon-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Auth / Profile Dropdown */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className="flex items-center gap-2 p-2.5 rounded-full bg-violet-100 text-violet-950 hover:bg-violet-200 transition border border-violet-200 shadow-sm"
                aria-label="Account"
              >
                <User size={21} />
              </button>

              {/* Floating Profile Menu */}
              {authDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-maroon-50 p-4 z-50 animate-fadeUp">
                  {status !== 'authenticated' ? (
                    <div>
                      <div className="text-center pb-3 mb-4 border-b border-maroon-50">
                        <h4 className="font-serif text-lg font-bold text-maroon-950">
                          Welcome to Jannat
                        </h4>
                        <p className="text-xs text-maroon-600 mt-0.5 font-sans">
                          Explore our collection and manage orders
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 font-sans">
                        <Link
                          href="/login"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2 bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-md"
                        >
                          <LogIn size={14} /> Log In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2 border border-maroon-250 text-maroon-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition hover:bg-maroon-50/50"
                        >
                          <UserPlus size={14} /> Create Account
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="font-sans">
                      <div className="pb-3 mb-3 border-b border-maroon-50">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold text-maroon-950 truncate">
                          {user?.name || user?.email}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 mb-3">
                        <Link
                          href="/profile"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 w-full py-2 px-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-sm transition hover:brightness-110"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 w-full py-2 px-3 bg-gradient-to-r from-violet-600 to-indigo-700 text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-sm transition hover:brightness-110"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/shop?wishlist=true"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2 w-full py-2 px-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-sm transition hover:brightness-110"
                        >
                          My Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="flex items-center gap-2 w-full py-2 px-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-sm transition hover:brightness-110"
                          >
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setAuthDropdownOpen(false);
                          void logout();
                        }}
                        className="flex items-center gap-2 w-full py-2 px-3 text-red-650 hover:bg-red-50 text-xs font-semibold rounded-lg transition"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeUp">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Shararas, Gararas, bridal collection..."
                className="w-full bg-[#fff0f3] border border-maroon-100 text-maroon-950 rounded-full py-3 pl-11 pr-4 outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-700 transition placeholder:text-maroon-400 text-sm font-sans"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden pb-5 animate-fadeUp">
            <nav className="mt-2 flex flex-col gap-2.5 border-t border-maroon-100 pt-5 font-sans" aria-label="Mobile navigation">
              <Link
                onClick={() => setMenuOpen(false)}
                href="/"
                className="flex min-h-12 items-center rounded-xl border border-rose-300 bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(225,29,72,.22)] transition duration-200 hover:-translate-y-0.5 hover:from-rose-600 hover:to-pink-700 hover:shadow-[0_12px_24px_rgba(225,29,72,.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                Home
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop"
                className="flex min-h-12 items-center rounded-xl border border-fuchsia-300 bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(147,51,234,.22)] transition duration-200 hover:-translate-y-0.5 hover:from-fuchsia-700 hover:to-purple-800 hover:shadow-[0_12px_24px_rgba(147,51,234,.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
              >
                Shop
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop?category=Frock Suit"
                className="flex min-h-12 items-center rounded-xl border border-amber-300 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(234,88,12,.22)] transition duration-200 hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700 hover:shadow-[0_12px_24px_rgba(234,88,12,.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
              >
                Frock Suits
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop?category=Sharara Suit"
                className="flex min-h-12 items-center rounded-xl border border-indigo-300 bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(79,70,229,.22)] transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-800 hover:shadow-[0_12px_24px_rgba(79,70,229,.28)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                Sharara Suits
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop?wishlist=true"
                className="flex min-h-12 items-center justify-between rounded-xl border border-pink-300 bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(236,72,153,.2)] transition duration-200 hover:-translate-y-0.5 hover:from-pink-600 hover:to-rose-700 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
              >
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-pink-700 shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {status !== 'authenticated' ? (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/login"
                    className="flex min-h-12 items-center rounded-xl border border-maroon-300 bg-gradient-to-r from-maroon-800 to-maroon-950 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(74,14,23,.2)] transition duration-200 hover:-translate-y-0.5 hover:from-maroon-900 hover:to-maroon-950 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-800"
                  >
                    Log In
                  </Link>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/signup"
                    className="flex min-h-12 items-center rounded-xl border border-teal-300 bg-gradient-to-r from-teal-600 to-cyan-700 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(8,145,178,.2)] transition duration-200 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-800 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/orders"
                    className="flex min-h-12 items-center rounded-xl border border-sky-300 bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,.2)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-700 hover:to-blue-800 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    My Orders
                  </Link>
                  <Link onClick={() => setMenuOpen(false)} href="/profile" className="flex min-h-12 items-center rounded-xl border border-violet-300 bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(124,58,237,.2)] transition duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-800 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">My Profile</Link>
                  {user?.role === 'admin' && (
                    <Link
                      onClick={() => setMenuOpen(false)}
                      href="/admin"
                      className="flex min-h-12 items-center rounded-xl border border-amber-300 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-base font-extrabold text-white shadow-[0_8px_18px_rgba(234,88,12,.22)] transition duration-200 hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-700 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                    >
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                    className="flex min-h-12 items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-left text-base font-bold text-red-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    <LogOut size={14} /> Log Out
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
