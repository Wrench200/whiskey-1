'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WhiskeyProduct } from '@/types/product';
import whiskeyProducts from '@/data/whiskey-products-local.json';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WhiskeyProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allProducts = whiskeyProducts as WhiskeyProduct[];

  // Real-time search as user types with debouncing
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Debounce search for better performance
    const timeoutId = setTimeout(() => {
      const searchTerm = query.toLowerCase().trim();
      
      // Score products based on match quality with intelligent ranking
      const scoredProducts = allProducts
        .map((product) => {
          const nameLower = product.name.toLowerCase();
          const brandLower = product.brand.toLowerCase();
          const distilleryLower = product.distillery?.toLowerCase() || '';
          
          let score = 0;
          
          // Exact matches get highest score
          if (nameLower === searchTerm) score += 100;
          if (brandLower === searchTerm) score += 50;
          
          // Starts with search term (very relevant)
          if (nameLower.startsWith(searchTerm)) score += 20;
          if (brandLower.startsWith(searchTerm)) score += 15;
          
          // Contains search term
          if (nameLower.includes(searchTerm)) score += 10;
          if (brandLower.includes(searchTerm)) score += 5;
          if (distilleryLower.includes(searchTerm)) score += 3;
          
          // Word boundary matches (matches whole words)
          const nameWords = nameLower.split(/\s+/);
          const brandWords = brandLower.split(/\s+/);
          nameWords.forEach(word => {
            if (word.startsWith(searchTerm)) score += 8;
            if (word === searchTerm) score += 12;
          });
          brandWords.forEach(word => {
            if (word.startsWith(searchTerm)) score += 4;
            if (word === searchTerm) score += 6;
          });
          
          return { product, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((item) => item.product);

      setResults(scoredProducts);
      setIsOpen(scoredProducts.length > 0);
      setSelectedIndex(-1);
    }, 150); // 150ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleProductClick(results[selectedIndex].id);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        onClose?.();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search for whiskey..."
            className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm font-light"
            autoFocus
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            {results.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                  onClose?.();
                }}
                className={`block p-3 rounded-md hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  {product.imageUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="text-xs text-gray-400 mb-1 font-light">{product.brand}</div>
                    <h4 className="text-sm font-normal text-gray-900 truncate">
                      {highlightMatch(product.name, query)}
                    </h4>
                    <p className="text-sm font-medium text-gray-900 mt-1">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
            {query.trim() && (
              <button
                onClick={handleSearch}
                className="w-full mt-2 p-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                View all results for "{query}"
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
          <p className="text-sm text-gray-500 text-center font-light">
            No products found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}

