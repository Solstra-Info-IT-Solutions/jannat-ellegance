'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Compass } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-maroon-950 text-white font-sans mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Social Links */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-maroon-200 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0 relative">
              <Image
                src="/images/logo.jpeg"
                alt="Jannat Elegance Logo"
                fill
                className="object-cover"
              />
            </div>
              <div>
                <h2 className="font-serif text-3xl tracking-wide text-white leading-none">
                  JANNAT
                </h2>
                <p className="text-pink-300 text-m tracking-[5px] mt-1 uppercase">
                  Elegance
                </p>
              </div>
            </div>
            <p className="text-pink-100/80 leading-7 mt-5 text-sm">
              Timeless Indian fashion designed to celebrate femininity, heritage, and contemporary elegance. Made for the queen within you.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/jannat.elegance?igsi=MTV1NHo2aXdwYWppaA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 transition flex items-center justify-center text-pink-200 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61592768348073"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center text-pink-200 hover:text-white"
              >
                <Facebook size={18} />
              </a>
              {/* <a
                href="https://youtube.com/jannatelegance"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 transition flex items-center justify-center text-pink-200 hover:text-white"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://pinterest.com/jannatelegance"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-700 transition flex items-center justify-center text-pink-200 hover:text-white"
              >
                <Compass size={18} />
              </a> */}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="font-serif text-lg text-white mb-6 font-medium">
              Shop Categories
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/shop?category=Sharara Suit" className="text-pink-100/80 hover:text-pink-300 transition">
                  Sharara Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Garara Suit" className="text-pink-100/80 hover:text-pink-300 transition">
                  Garara Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Frock Suit" className="text-pink-100/80 hover:text-pink-300 transition">
                  Anarkali Frock Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Lehnga" className="text-pink-100/80 hover:text-pink-300 transition">
                  Bridal Lehngas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Gown" className="text-pink-100/80 hover:text-pink-300 transition">
                  Evening Gowns
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Customer Care */}
          <div>
            <h3 className="font-serif text-lg text-white mb-6 font-medium">
              Customer Care
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/contact-us" className="text-pink-100/80 hover:text-pink-300 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-pink-100/80 hover:text-pink-300 transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/exchange-policy" className="text-pink-100/80 hover:text-pink-300 transition">
                  Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-pink-100/80 hover:text-pink-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-pink-100/80 hover:text-pink-300 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:pl-4">
            <h3 className="mb-4 font-serif text-lg font-medium text-white">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-pink-300" />
                <a
                  href="https://www.google.com/maps?q=28.57,77.32"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-100/80 hover:text-pink-300 transition-colors">
                  JANNAT ELEGANCE, Noida, India
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-pink-300 shrink-0" />
                <a href="tel:+918810330687" className="text-pink-100/80 hover:text-pink-300 transition">
                  +91 88103 30687
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-pink-300 shrink-0" />
                <a href="mailto:jannatelegance05@gmail.com" className="text-pink-100/80 hover:text-pink-300 transition">
                  jannatelegance05@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-white/10 bg-maroon-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-pink-200/60 text-xs text-center md:text-left">
              &copy; {currentYear} Jannat Elegance. All rights reserved. Designed with grace.
            </p>
            <div className="flex gap-6 text-xs text-pink-200/60">
              <Link href="/privacy-policy" className="hover:text-pink-300 transition">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-pink-300 transition">
                Terms of Service
              </Link>
              <Link href="/exchange-policy" className="hover:text-pink-300 transition">
                Exchange Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
