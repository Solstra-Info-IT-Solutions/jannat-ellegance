'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
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
            className="lg:hidden rounded-lg border border-pink-200 bg-white p-2 text-maroon-850 transition hover:bg-pink-50"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} strokeWidth={2.3} className="!text-maroon-850" /> : <Menu size={26} strokeWidth={2.3} className="!text-maroon-850" />}
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
          <nav className="hidden lg:flex items-center gap-2 rounded-full border border-pink-100 bg-white p-1.5 text-sm font-bold font-sans">
            <Link
              href="/"
              className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
            >
              Shop
            </Link>

            <Link
              href="/#about"
              className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-maroon-950">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full border border-pink-200 bg-pink-50 text-maroon-850 transition hover:bg-pink-100 shadow-sm"
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
                className="flex items-center gap-2 p-2.5 rounded-full border border-pink-200 bg-maroon-50 text-maroon-850 transition hover:bg-pink-100 shadow-sm"
                aria-label="Account"
              >
                <User size={21} strokeWidth={2.2} className="!text-maroon-850" />
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
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-pink-200 bg-pink-50 py-2 text-xs font-semibold uppercase tracking-wider text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                        >
                          <LogIn size={14} /> Log In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center justify-center gap-2 w-full rounded-lg border border-pink-600 bg-pink-600 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-maroon-850 hover:bg-maroon-850"
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
                          className="flex w-full items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                        >
                          <User size={14} /> My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                        >
                          <Package size={14} /> My Orders
                        </Link>
                        <Link
                          href="/track-order"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                        >
                          <Package size={14} /> Track My Order
                        </Link>
                        <Link
                          href="/shop?wishlist=true"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                        >
                          <Heart size={14} /> My Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="flex w-full items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                          >
                            <LayoutDashboard size={14} /> Admin Console
                          </Link>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setAuthDropdownOpen(false);
                          void logout();
                        }}
                        className="flex items-center gap-2 w-full rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-semibold text-maroon-850 transition hover:border-maroon-850 hover:bg-maroon-850 hover:text-white"
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
            <nav className="mt-2 flex flex-col gap-3 border-t border-pink-100 pt-5 font-sans" aria-label="Mobile navigation">
              <Link
                onClick={() => setMenuOpen(false)}
                href="/"
                className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
              >
                <House size={22} strokeWidth={1.8} /> Home
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop"
                className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
              >
                <ShoppingBag size={22} strokeWidth={1.8} /> Shop
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                href="/shop?wishlist=true"
                className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
              >
                <Heart size={22} strokeWidth={1.8} /> <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="ml-auto rounded-full bg-maroon-850 px-2.5 py-0.5 text-xs font-extrabold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {status !== 'authenticated' ? (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/login"
                    className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                  >
                    <User size={22} strokeWidth={1.8} /> Log In
                  </Link>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/signup"
                    className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-600 bg-pink-600 px-4 py-3 text-base font-bold text-white transition hover:bg-maroon-850"
                  >
                    <UserPlus size={22} strokeWidth={1.8} /> Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/orders"
                    className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                  >
                    <Package size={22} strokeWidth={1.8} /> My Orders
                  </Link>
                  <Link onClick={() => setMenuOpen(false)} href="/profile" className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"><User size={22} strokeWidth={1.8} /> My Profile</Link>
                  {user?.role === 'admin' && (
                    <Link
                      onClick={() => setMenuOpen(false)}
                      href="/admin"
                      className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-base font-extrabold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
                    >
                      <LayoutDashboard size={22} strokeWidth={1.8} /> Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                    className="flex min-h-12 items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-left text-base font-bold text-maroon-850 transition hover:border-pink-300 hover:bg-pink-100"
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
