import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
      

        {/* 404 Text */}
        <h1 className="text-9xl sm:text-[12rem] font-light text-red-600 mb-4 tracking-tight" data-aos="fade-up">
          404
        </h1>
        
        {/* Error Message */}
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight" data-aos="fade-up" data-aos-delay="100">
          Page Not Found
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-600 font-light mb-8 max-w-md mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="200">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to exploring our premium whiskey collection.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="300">
          <Link
            href="/"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          <Link
            href="/collections"
            className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-8 rounded-md border border-gray-300 transition-colors duration-200"
          >
            Browse Collections
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200" data-aos="fade-up" data-aos-delay="400">
          <p className="text-sm text-gray-500 font-light mb-4">Popular Pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/best-sellers" className="text-gray-600 hover:text-gray-900 transition-colors font-light">
              Best Sellers
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/collections/whiskey" className="text-gray-600 hover:text-gray-900 transition-colors font-light">
              All Products
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-light">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-light">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

