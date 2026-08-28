'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fff8fa] py-12 sm:py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-maroon-800 transition mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <article className="bg-white rounded-[32px] border border-maroon-100 p-8 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-normal border-b border-maroon-100 pb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">Last updated: August 2026</p>

          <p>
            At Jannat Elegance, accessible from our online storefront, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Jannat Elegance and how we use it.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information (such as shipping address, telephone coordinates, and billing details during checkout).
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, operate, and maintain our website and order processing.</li>
            <li>Improve, personalize, and expand our website offerings.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Process transactions, notify order status updates, and manage shipments.</li>
          </ul>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">3. Log Files</h2>
          <p>
            Jannat Elegance follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, Jannat Elegance uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </article>
      </div>
    </main>
  );
}
