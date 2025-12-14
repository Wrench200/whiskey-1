'use client';

interface InfiniteTextSliderProps {
  text: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export default function InfiniteTextSlider({ 
  text, 
  speed = 'fast',
  className = '' 
}: InfiniteTextSliderProps) {
  const speedClass = {
    slow: 'animate-scroll-slow',
    normal: 'animate-scroll',
    fast: 'animate-scroll-fast'
  }[speed];

  // Duplicate the text multiple times for seamless loop
  const duplicatedText = Array(10).fill(text).join('       •       ');

  return (
    <div className={`overflow-hidden bg-gray-100 py-5 md:py-20 ${className}`}>
      <div className={`flex whitespace-nowrap  ${speedClass}`}>
        <div className="inline-flex items-center">
          <span className="px-8 md:px-12 text-base md:text-lg lg:text-xl font-normal text-gray-700 uppercase tracking-wide">
            {duplicatedText}
          </span>
        </div>
        <div className="inline-flex items-center" aria-hidden="true">
          <span className="px-8 md:px-12 text-base md:text-lg lg:text-xl font-normal text-gray-700 uppercase tracking-wide">
            {duplicatedText}
          </span>
        </div>
      </div>
    </div>
  );
}

