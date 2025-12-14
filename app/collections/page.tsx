'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import whiskeyProductsData from '@/data/whiskey-products-enhanced.json';
import { WhiskeyProduct } from '@/types/product';

const allProducts = whiskeyProductsData as WhiskeyProduct[];

// Get unique product types
const productTypes = Array.from(new Set(allProducts.map(p => p.productType || 'Whiskey')))
  .filter(Boolean)
  .sort();

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500">
          <span className="hover:text-gray-900"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Collections</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Collections</h1>
        <p className="text-base text-gray-600 font-light max-w-3xl">
          Explore our curated collections of premium whiskeys, bourbons, scotch, and rare selections from around the world.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 mb-12">
        {productTypes.map((type, index) => {
          const typeProducts = allProducts.filter(p => (p.productType || 'Whiskey') === type);
          const count = typeProducts.length;
          const featuredProduct = typeProducts[0];

          return (
            <Link
              key={type}
              href={`/collections/whiskey?type=${encodeURIComponent(type)}`}
              className="group"
              data-aos="fade-up"
              data-aos-delay={index % 4 * 100}
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {featuredProduct?.imageUrl && (
                  <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <Image
                      src={featuredProduct.imageUrl}
                      alt={type}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                    {type}
                  </h2>
                  <p className="text-sm text-gray-500 font-light">
                    {count} {count === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* All Products Link */}
      <div className="text-center">
        <Link
          href="/collections/whiskey"
          className="inline-block text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          View All Whiskey Products →
        </Link>
      </div>
    </div>
  );
}

