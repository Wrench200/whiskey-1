import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/man-is-pouring-strong-alcohol-drink-into-glass.jpg"
          alt="Whiskey"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-sm md:text-lg mb-4 text-gray-100 font-light" data-aos="fade-up" data-aos-delay="100">
          Crafted to Perfection - Delivered with Care
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight" data-aos="fade-up" data-aos-delay="200">
          Golden Barrel Whiskey
        </h1>
        <p className="text-base md:text-lg lg:text-xl mb-8 text-gray-200 font-light max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="300">
          Discover exceptional whiskeys, bourbons, scotch, and rare selections from around the world. 
          From rare bourbon and scotch to Japanese and Irish varieties, our curated collection features 
          premium spirits for connoisseurs and casual drinkers alike.
        </p>
      </div>
    </section>
  );
}

