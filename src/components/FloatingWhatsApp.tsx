'use client';

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
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group flex items-center justify-center cursor-pointer"
      title="Chat with Jannat Elegance"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none" />
      
      {/* SVG Icon */}
      <svg
        className="w-7 h-7 relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.851-4.388 9.854-9.778.002-2.611-1.006-5.066-2.84-6.902C16.45 2.089 14.025 1.08 11.4 1.08c-5.43 0-9.843 4.39-9.846 9.78-.001 2.029.531 4.015 1.543 5.751L2.1 21.9l5.4-.73-.854-.424zm12.355-6.852c-.346-.172-2.049-1.007-2.363-1.12-.313-.115-.542-.172-.77.172-.228.344-.882 1.12-1.08 1.348-.198.228-.396.258-.742.086-1.03-.513-1.745-.986-2.585-2.426-.22-.376.22-.35.63-1.173.067-.136.033-.255-.017-.356-.05-.1-.442-1.066-.607-1.464-.16-.388-.323-.336-.442-.342-.114-.006-.244-.006-.375-.006-.13 0-.342.049-.52.246-.178.197-.68.664-.68 1.619s.694 1.874.792 2.006c.098.132 1.365 2.085 3.308 2.92.463.2 1.018.318 1.4.24.41-.06.843-.228 1.08-.49.237-.263.237-.49.166-.543-.07-.053-.268-.086-.613-.258z" />
      </svg>
      
      {/* Hover Tooltip */}
      <span className="absolute right-16 bg-maroon-950 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
