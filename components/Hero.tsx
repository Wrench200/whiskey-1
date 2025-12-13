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
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight">
          Golden Barrel Whiskey
        </h1>
        <p className="text-lg md:text-xl mb-12 text-gray-100 font-light">
          Crafted to Perfection - Delivered with Care
        </p>
      </div>
    </section>
  );
}

