import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Golden Barrel Whiskey - A leading online retailer offering premium alcohol delivery at your doorstep for the last 25 years.',
  openGraph: {
    title: 'About Golden Barrel Whiskey',
    description: 'Learn about Golden Barrel Whiskey - A leading online retailer offering premium alcohol delivery at your doorstep.',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500">
          <span className="hover:text-gray-900"><a href="/">Home</a></span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">About</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-12 text-center" data-aos="fade-up">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">About Golden Barrel Whiskey</h1>
        <p className="text-base text-gray-600 font-light max-w-2xl mx-auto">
          Crafted to Perfection - Delivered with Care
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray max-w-none space-y-8">
        <div data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            Golden Barrel Whiskey is a leading online retailer offering the services of alcohol delivery at your doorstep. 
            We've been doing this for the last 25 years and have created the best online experience in providing 
            top-quality & rare alcohol to our customers through our platform.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            Our mission is to bring exceptional whiskeys, bourbons, scotch, and rare spirits from around the world 
            directly to your door. We carefully curate our collection to ensure that every bottle meets our high 
            standards for quality and authenticity.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-light text-gray-900 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 font-light">
            <li>Premium selection of whiskeys, bourbons, and scotch</li>
            <li>Rare and limited edition bottles</li>
            <li>Fast and secure delivery to your doorstep</li>
            <li>Expert curation and recommendations</li>
            <li>Exceptional customer service</li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            We are committed to providing our customers with the finest selection of spirits, exceptional service, 
            and a seamless shopping experience. Every bottle we offer is carefully selected and authenticated to 
            ensure you receive only the best.
          </p>
        </div>
      </div>
    </div>
  );
}
