'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import whiskeyProductsData from '@/data/whiskey-products-enhanced.json';
import { WhiskeyProduct } from '@/types/product';

// Product types from the original website
const PRODUCT_TYPES = [
  'American Whiskey',
  'Bourbon',
  'Scotch',
  'Irish Whiskey',
  'Canadian Whiskey',
  'Japanese/Foreign',
  'Rye',
  'Flavored',
  'Liqueur',
  'Brandy',
  'Gin',
  'Rum',
  'Tequila',
  'Vodka',
  'Wine',
  'Beer',
  'Bitters',
  'Moonshine',
  'Mystery Box',
  'Ready To Drink',
  'RTD Cocktail',
  'Liquor & Spirits',
];

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';

function WhiskeyCollectionContent() {
  const searchParams = useSearchParams();
  
  // Get initial type from URL query parameter
  const initialType = searchParams.get('type');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialType ? [initialType] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  const allProducts = whiskeyProductsData as WhiskeyProduct[];

  // Get unique brands
  const brands = useMemo(() => {
    const brandSet = new Set(allProducts.map(p => p.brand).filter(Boolean));
    return Array.from(brandSet).sort();
  }, [allProducts]);

  // Get product type counts
  const productTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(product => {
      const type = product.productType || 'Whiskey';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  // Get brand counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(product => {
      if (product.brand) {
        counts[product.brand] = (counts[product.brand] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Filter by product type
      if (selectedTypes.length > 0) {
        const productType = product.productType || 'Whiskey';
        if (!selectedTypes.includes(productType)) return false;
      }

      // Filter by brand
      if (selectedBrands.length > 0) {
        if (!product.brand || !selectedBrands.includes(product.brand)) return false;
      }

      // Filter by price range
      const price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Filter by stock
      if (inStockOnly && product.inStock === false) return false;

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // 'featured'
        // Keep original order
        break;
    }

    return filtered;
  }, [allProducts, selectedTypes, selectedBrands, priceRange, inStockOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes, selectedBrands, priceRange, inStockOnly, sortBy]);

  const toggleProductType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-gray-900 transition-colors">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Whiskey</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Whiskey</h1>
          <p className="text-base text-gray-600 font-light max-w-3xl">
            Discover exceptional whisky and whiskey from around the world. From rare bourbon and scotch to Japanese and Irish varieties, our curated collection features premium spirits for connoisseurs and casual drinkers alike.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Filter</h2>
                {(selectedTypes.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || inStockOnly) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-900 mb-2 uppercase tracking-wider">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                  <option value="name-asc">Alphabetically, A-Z</option>
                  <option value="name-desc">Alphabetically, Z-A</option>
                </select>
              </div>

              {/* Product Count */}
              <div className="text-sm text-gray-600 font-light">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
              </div>

              {/* Product Type Filter */}
              <div>
                <h3 className="text-xs font-medium text-gray-900 mb-3 uppercase tracking-wider">Product type</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {PRODUCT_TYPES.map(type => {
                    const count = productTypeCounts[type] || 0;
                    if (count === 0) return null;
                    return (
                      <label key={type} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleProductType(type)}
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 font-light">
                          {type} ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-xs font-medium text-gray-900 mb-3 uppercase tracking-wider">Brand</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {brands.slice(0, 50).map(brand => {
                    const count = brandCounts[brand] || 0;
                    if (count === 0) return null;
                    return (
                      <label key={brand} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 font-light truncate">
                          {brand} ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-medium text-gray-900 mb-3 uppercase tracking-wider">Price</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 1000])}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 font-light">
                    In stock only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Filter
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-desc">Alphabetically, Z-A</option>
              </select>
            </div>

            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                currentPage === page
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Page info */}
                <div className="mt-6 text-center text-sm text-gray-600 font-light">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 font-light">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-gray-900 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function WhiskeyCollectionPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    }>
      <WhiskeyCollectionContent />
    </Suspense>
  );
}

