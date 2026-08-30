'use client';

import Image from 'next/image';
import React from 'react';

const FloatingWhatsApp: React.FC = () => {
  const phoneNumber = '918810330687';
  const message = 'Hello Jannat Elegance, I would like to inquire about your collections.';
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 right-6 z-40 grid h-16 w-16 place-items-center rounded-full border-2 border-pink-300 bg-white p-1 shadow-[0_8px_20px_rgba(74,14,23,.24)] transition-transform hover:scale-105 focus-visible:outline-none"
      title="Chat with Jannat Elegance"
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="/images/whatsapp-logo-4456_512.png"
        alt=""
        width={56}
        height={56}
        className="h-full w-full rounded-full object-contain"
        priority
      />
      
      <span className="pointer-events-none absolute right-[4.5rem] whitespace-nowrap rounded-md bg-maroon-850 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
