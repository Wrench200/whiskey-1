'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import SearchBar from './SearchBar';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartItems, getTotalItems, removeFromCart, updateQuantity } = useCart();

  const totalItems = getTotalItems();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 overflow-visible">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Golden Barrel Whiskey"
              width={150}
              height={70}
              className="h-8 sm:h-20 w-auto"
              priority
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
              Home
            </Link>
            <Link href="/collections" className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
              Collections
            </Link>
            <Link href="/best-sellers" className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
              Best Sellers
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
              Contact
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm font-normal transition-colors">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              {showSearch && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
                  <SearchBar onClose={() => setShowSearch(false)} />
                </div>
              )}
            </div>

            {/* Cart Dropdown */}
            <div className="relative">
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                onMouseEnter={() => setShowCart(true)}
                onMouseLeave={() => setShowCart(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.925-6.75a6.324 6.324 0 00-1.667-2.137M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Cart Dropdown */}
              {showCart && cartItems.length > 0 && (
                <div
                  className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50"
                  onMouseEnter={() => setShowCart(true)}
                  onMouseLeave={() => setShowCart(false)}
                >
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
                                −
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed left-0 top-0 h-full w-[50vw] sm:w-80 max-w-sm bg-white border-r border-gray-200 shadow-lg z-50 md:hidden transition-transform duration-300 ease-in-out ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link href="/" onClick={() => setShowMobileMenu(false)}>
              <Image
                src="/Logo.png"
                alt="Golden Barrel Whiskey"
                width={150}
                height={40}
                className="h-16 w-auto"
              />
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="py-8 space-y-1">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-normal transition-colors "
            >
              Home
            </Link>
            <Link
              href="/collections"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-normal transition-colors "
            >
              Collections
            </Link>
            <Link
              href="/best-sellers"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-normal transition-colors "
            >
              Best Sellers
            </Link>
            <Link
              href="/contact"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-normal transition-colors "
            >
              Contact
            </Link>
            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-normal transition-colors "
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

