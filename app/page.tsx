'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import InfiniteTextSlider from '@/components/InfiniteTextSlider';
import whiskeyProducts from '@/data/whiskey-products-local.json';
import { WhiskeyProduct } from '@/types/product';

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const allProducts = whiskeyProducts as WhiskeyProduct[];
  
  // Filter products based on search query
  const filteredProducts = searchQuery
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts;
  
  const products = filteredProducts;
  
  // Get best sellers (first 12 products)
  const bestSellers = allProducts.slice(0, 12);
  
  // Get rare selection (products with higher prices, or specific ones)
  const rareSelection = allProducts.filter(p => {
    const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, ''));
    return priceNum >= 100;
  }).slice(0, 12);

  return (
    <>
      <Hero />
      
      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-aos="fade-up">
          <h2 className="text-xl font-light text-gray-900 mb-2 tracking-tight">
            Search Results for "{searchQuery}"
          </h2>
          {filteredProducts.length > 0 ? (
            <p className="text-sm text-gray-500 mb-8 font-light">
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-8 font-light">No products found. Try a different search term.</p>
          )}
        </div>
      )}
      
      {/* Best Sellers Section */}
      {!searchQuery && (
        <ProductGrid 
          products={bestSellers} 
          title="BEST SELLERS"
        />
      )}
      
      {/* Infinite Text Slider */}
      {!searchQuery && (
        <>
          <InfiniteTextSlider 
            text="CRAFTED TO PERFECTION - DELIVERED WITH CARE"
            speed="fast"
          />
          <div className="border-b border-gray-200"></div>
        </>
      )}
      
      {/* Rare Selection Section */}
      {!searchQuery && rareSelection.length > 0 && (
        <div className="bg-white py-12">
          <ProductGrid 
            products={rareSelection} 
            title="RARE SELECTION"
          />
        </div>
      )}
      
      {/* All Products / Search Results Section */}
      <ProductGrid 
        products={products} 
        title={searchQuery ? "SEARCH RESULTS" : "ALL WHISKEY PRODUCTS"}
      />
      
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
    </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
