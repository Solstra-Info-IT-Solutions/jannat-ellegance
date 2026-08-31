'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-gray-400">Last updated: August 2026</p>

          <p>
            Welcome to Jannat Elegance. These terms and conditions outline the rules and regulations for the use of Jannat Elegance's Website, located at Noida, India.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">1. License</h2>
          <p>
            Unless otherwise stated, Jannat Elegance and/or its licensors own the intellectual property rights for all material on Jannat Elegance. All intellectual property rights are reserved. You may access this from Jannat Elegance for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">2. User Comments &amp; Feedback</h2>
          <p>
            Parts of this website offer an opportunity for users to post reviews and opinions in certain areas of the website. Jannat Elegance does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Jannat Elegance, its agents and/or affiliates.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">3. Hyperlinking to our Content</h2>
          <p>
            Organizations may link to our home page, to publications or to other Website information so long as the link is not in any way deceptive, does not falsely imply sponsorship, endorsement or approval of the linking party and its products/services, and fits within the context of the linking party’s site.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">4. Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal.
          </p>
        </article>
      </div>
    </main>
  );
}
