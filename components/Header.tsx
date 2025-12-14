'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { Menu, X, Search, ShoppingCart, Minus, Plus } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartItems, getTotalItems, removeFromCart, updateQuantity } = useCart();

  const totalItems = getTotalItems();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 overflow-visible">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none md:translate-0 flex items-center">
            <Image
              src="/Logo.png"
              alt="Golden Barrel Whiskey"
              width={150}
              height={70}
              className="h-20 sm:h-24 w-auto"
              priority
            />
          </Link>
          
          {/* Spacer for mobile to balance the menu button */}
          <div className="md:hidden w-6"></div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-base font-normal transition-colors ${
                isActive('/') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/collections" 
              className={`text-base font-normal transition-colors ${
                isActive('/collections') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Collections
            </Link>
            <Link 
              href="/best-sellers" 
              className={`text-base font-normal transition-colors ${
                isActive('/best-sellers') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best Sellers
            </Link>
            <Link 
              href="/contact" 
              className={`text-base font-normal transition-colors ${
                isActive('/contact') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
            <Link 
              href="/about" 
              className={`text-base font-normal transition-colors ${
                isActive('/about') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Search Backdrop */}
              {showSearch && (
                <div
                  className="fixed inset-0 backdrop-blur-xs bg-black/70 z-40"
                  onClick={() => setShowSearch(false)}
                />
              )}
              
              {/* Search Bar */}
              {showSearch && (
                <div className="fixed inset-x-0 top-1/4 -translate-y-1/4 px-4 z-50">
                  <div className="max-w-md mx-auto bg-white rounded-md shadow-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Search</h3>
                      <button
                        onClick={() => setShowSearch(false)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close search"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <SearchBar onClose={() => setShowSearch(false)} />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Dropdown */}
            <div className="relative">
              <Link
                href="/cart"
                className={`relative inline-flex items-center justify-center transition-colors cursor-pointer ${
                  isActive('/cart') ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-gray-900'
                }`}
                onMouseEnter={() => setShowCart(true)}
                onMouseLeave={() => setShowCart(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute bottom-5 left-5 bg-gray-900 text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Cart Dropdown */}
              {showCart && cartItems.length > 0 && (
                <div
                  className="absolute right-0 top-full -mt-1.5 w-[calc(100vw-2rem)] sm:w-80 max-w-sm z-50"
                  onMouseEnter={() => setShowCart(true)}
                  onMouseLeave={() => setShowCart(false)}
                >
                  <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-4 text-sm">Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0">
                          {item.imageUrl && (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-contain"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/cart"
                      className="mt-4 block w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md text-center transition-colors text-sm"
                    >
                      View Cart
                    </Link>
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 backdrop-blur-xs bg-black/700 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed left-0 top-0 h-full w-[70vw] sm:w-80 max-w-sm bg-white border-r border-gray-200 shadow-lg z-50 md:hidden transition-transform duration-300 ease-in-out ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="py-4">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 text-sm font-normal transition-colors ${
                isActive('/') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              href="/collections"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 text-sm font-normal transition-colors ${
                isActive('/collections') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Collections
            </Link>
            <Link
              href="/best-sellers"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 text-sm font-normal transition-colors ${
                isActive('/best-sellers') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best Sellers
            </Link>
            <Link
              href="/contact"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 border-b border-gray-200 hover:bg-gray-50 text-sm font-normal transition-colors ${
                isActive('/contact') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-3 hover:bg-gray-50 text-sm font-normal transition-colors ${
                isActive('/about') ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

