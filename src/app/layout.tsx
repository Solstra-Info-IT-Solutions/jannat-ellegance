import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

import { CartProvider } from '@/context/CartContext';
import AuthProvider from '@/context/AuthProvider';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import QuickHelp from '@/components/QuickHelp'
import Loader from '@/components/Loader';

import { Toaster } from 'react-hot-toast';

const cormorant = Cormorant_Garamond({
subsets: ['latin'],
variable: '--font-serif',
weight: ['300', '400', '500', '600', '700'],
display: 'swap',
});

const inter = Inter({
subsets: ['latin'],
variable: '--font-sans',
display: 'swap',
});

export const metadata: Metadata = {
title: 'Jannat Elegance | Premium Indian Ethnic Wear',
description:
'Jannat Elegance offers a curated collection of luxury Indian ethnic wear including Sharara Suits, Garara Suits, Pant Suits, Farshi Shalwar Suits, Frock Suits, Gowns, and Lehngas. Crafted for the modern queen.',
keywords:
'Jannat Elegance, ethnic wear, Indian fashion, Sharara Suit, Garara Suit, Pant Suit, Farshi Shalwar, Frock Suit, Gown, Lehnga, Plazo Suit',
icons: {
icon: '/favicon.ico',
apple: '/apple-touch-icon.png',
},
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html
lang="en"
className={`${inter.variable} ${cormorant.variable}`}
> <body className="min-h-screen flex flex-col font-sans bg-[#fff8fa] text-rose-950 antialiased overflow-x-hidden"> <AuthProvider> <CartProvider>
        {/* Global Website Loader */}
        <Loader />

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
        />

        {/* Header / Navbar */}
        <Suspense
          fallback={
            <div className="h-20 bg-[#fff8fa] animate-pulse" />
          }
        >
          <Navbar />
        </Suspense>

        {/* Main Workspace */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* WhatsApp Floating Button */}
        <FloatingWhatsApp />
        <QuickHelp/>

      </CartProvider>
    </AuthProvider>

    {/* Razorpay Integration */}
    <Script
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload"
    />

    {/* Google Sign-In */}
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
  </body>
</html>

);
}
