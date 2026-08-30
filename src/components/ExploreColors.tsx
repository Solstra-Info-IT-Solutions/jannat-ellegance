import Image from "next/image";
import Link from "next/link";
import imageOne from "../assets/imageone.jpeg";
import imageTwo from "../assets/imagetwo.jpeg";
import imageThree from "../assets/imagethree.jpeg";

const ExploreColors = () => {
  const colorCards = [
    { id: 1, image: imageOne, alt: "Rose Pink Collection", link: "/shop" },
    { id: 2, image: imageTwo, alt: "Royal Maroon Collection", link: "/shop" },
    { id: 3, image: imageThree, alt: "Blush Pink Collection", link: "/shop" },
  ];

  return (
    <section className="bg-[#4a0e17] text-white py-14 px-4 sm:px-6 lg:px-8 my-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Content Box */}
        <div className="w-full lg:w-1/3 text-left space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight">
            Explore Our Most Loved Colors
          </h2>
          <p className="text-pink-100/90 text-sm sm:text-base font-light max-w-md">
            Find the shades everyone&apos;s obsessing over - bold, classic, or trending.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-[#fff8fa] text-[#4a0e17] font-semibold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 shadow-md hover:bg-pink-100 transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right Side: Image Cards Grid with Offset Effect */}
        <div className="w-full lg:w-2/3 grid grid-cols-3 gap-3 sm:gap-6">
          {colorCards.map((card, idx) => (
            <Link
              key={card.id}
              href={card.link}
              className={`relative group aspect-[3/4.5] overflow-hidden bg-pink-100/20 shadow-xl transition-all duration-500 ${
                idx % 2 === 1 ? "-translate-y-2 sm:-translate-y-4" : ""
              }`}
            >
              {/* Background Accent Border Layer */}
              <div className="absolute inset-0 border-2 border-[#fce7f3]/30 pointer-events-none z-10 group-hover:border-[#fff8fa] transition-colors duration-300" />
              
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Subtle Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExploreColors;