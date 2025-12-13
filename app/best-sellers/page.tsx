'use client';

import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import whiskeyProductsData from '@/data/whiskey-products-enhanced.json';
import { WhiskeyProduct } from '@/types/product';

const allProducts = whiskeyProductsData as WhiskeyProduct[];

// Get best sellers - top products by popularity (using first 24 as best sellers)
const bestSellers = allProducts.slice(0, 24);

export default function BestSellersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500">
          <span className="hover:text-gray-900"><a href="/">Home</a></span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Best Sellers</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Best Sellers</h1>
        <p className="text-base text-gray-600 font-light max-w-3xl">
          Discover our most popular and highly-rated whiskeys, carefully selected by our customers and experts.
        </p>
      </div>

      {/* Best Sellers Grid */}
      <ProductGrid products={bestSellers} title="" />
    </div>
  );
}

