'use client';

import React from 'react';
import { Heart, Sparkles, Star, Award } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-maroon-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-pink-600 uppercase tracking-[4px] text-xs font-bold font-sans">
            Our Identity
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-maroon-950 mt-2 font-normal">
            About Jannat Elegance
          </h2>
          <div className="w-20 h-0.5 bg-maroon-300 mx-auto mt-4 rounded" />
        </div>

        {/* Two-Column Details */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mb-16">
          
          {/* Column 1: Our Story */}
          <div className="bg-[#fff8fa] p-8 sm:p-12 rounded-[30px] border border-maroon-50 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <Heart size={20} className="fill-pink-500 text-pink-500" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-maroon-950 font-medium">
                  Our Story
                </h3>
              </div>
              <p className="text-gray-700 leading-8 text-sm sm:text-base font-normal">
                Jannat Elegance was born from a love for timeless Indian fashion and the belief that every woman deserves to feel beautiful, confident and effortlessly elegant. We bring together traditional inspiration and contemporary design to create ethnic wear that feels graceful, luxurious and relevant to today's woman.
              </p>
              <p className="text-gray-700 leading-8 text-sm sm:text-base font-normal mt-4">
                Every design is thoughtfully created with attention to silhouette, fabric, colour and detail—because true elegance lies in the little things.
              </p>
            </div>
            
            <div className="border-t border-maroon-100/50 pt-6 mt-8">
              <p className="font-serif text-xl italic text-maroon-900 font-medium">
                "Jannat Elegance is more than clothing. It is a feeling. It is confidence. It is the queen within you."
              </p>
            </div>
          </div>

          {/* Column 2: Our Philosophy */}
          <div className="bg-maroon-950 text-white p-8 sm:p-12 rounded-[30px] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-pink-300">
                  <Sparkles size={20} className="fill-pink-400 text-pink-400" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                  Our Philosophy
                </h3>
              </div>
              
              <p className="text-pink-100 uppercase tracking-widest text-xs font-semibold font-sans mb-3">
                Designed With Grace. Made To Be Remembered.
              </p>
              
              <p className="text-pink-100/90 leading-8 text-sm sm:text-base font-normal">
                At Jannat Elegance, we believe fashion should do more than dress you—it should express you. Our designs celebrate femininity, Indian heritage and modern elegance, creating pieces that you can cherish, wear and make your own.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 mt-8 flex justify-between items-center flex-wrap gap-4 text-xs tracking-widest uppercase font-semibold text-pink-300 font-sans">
              <span>Timeless</span>
              <span>•</span>
              <span>Feminine</span>
              <span>•</span>
              <span>Elegant</span>
              <span>•</span>
              <span>Effortless</span>
            </div>
          </div>

        </div>

        {/* Why Choose Us & Brand Promise */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm hover:-translate-y-1 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-800 mb-4">
              <Award size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-maroon-950 mb-2">
              Thoughtful Designs
            </h4>
            <p className="text-xs text-gray-500 leading-5">
              Every piece is created with an eye for elegance, shape, alignment and detail.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm hover:-translate-y-1 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-800 mb-4">
              <Star size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-maroon-950 mb-2">
              Premium Feel
            </h4>
            <p className="text-xs text-gray-500 leading-5">
              We focus on beautiful fabrics, refined finishing, comfort, and premium quality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm hover:-translate-y-1 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-800 mb-4">
              <Sparkles size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-maroon-950 mb-2">
              Timeless Style
            </h4>
            <p className="text-xs text-gray-500 leading-5">
              Designed to remain elegant beyond fleeting trends, making them permanent additions to your wardrobe.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-maroon-100 shadow-sm hover:-translate-y-1 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center text-maroon-800 mb-4">
              <Heart size={20} />
            </div>
            <h4 className="font-serif text-lg font-bold text-maroon-950 mb-2">
              Made for Her
            </h4>
            <p className="text-xs text-gray-500 leading-5">
              Because every woman deserves to feel confident, unique, and elegant in what she wears.
            </p>
          </div>

        </div>

        {/* Brand Promise Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-maroon-900 to-maroon-950 rounded-[40px] text-center p-12 lg:p-16 shadow-xl border border-maroon-850">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl" />
          
          <span className="text-pink-300 text-xs font-bold tracking-[4px] uppercase font-sans">
            Brand Promise
          </span>
          
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white mt-3 mb-6">
            Wear Your Elegance. Own Your Moment.
          </h3>
          
          <p className="text-pink-100/80 max-w-2xl mx-auto text-sm sm:text-base leading-7">
            Whether it's a festive celebration, a family gathering, a special occasion or simply a day when you want to feel beautiful—Jannat Elegance is designed to be part of your moments.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
