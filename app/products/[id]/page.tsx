'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { WhiskeyProduct } from '@/types/product';
import whiskeyProductsEnhanced from '@/data/whiskey-products-enhanced.json';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';

// Use enhanced data with all product details
const whiskeyProducts = whiskeyProductsEnhanced as WhiskeyProduct[];

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const product = (whiskeyProducts as WhiskeyProduct[]).find(
    (p) => p.id === id
  );

  if (!product) {
    notFound();
  }

  const hasDiscount = product.regularPrice !== null && product.regularPrice !== '';
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  
  // Product options state
  const [options, setOptions] = useState({
    giftWrapping: false,
    giftMessage: false,
    engraving: false,
    insurance: false,
    expressShipping: false,
  });

  // Accordion state for product content sections
  const [accordionOpen, setAccordionOpen] = useState({
    description: false,
    highlights: false,
    tastingNotes: false,
  });

  const toggleAccordion = (section: keyof typeof accordionOpen) => {
    setAccordionOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get related products (same brand or similar price range)
  const relatedProducts = (whiskeyProducts as WhiskeyProduct[])
    .filter((p) => p.id !== product.id && (p.brand === product.brand || 
      Math.abs(parseFloat(p.price.replace(/[^0-9.]/g, '')) - parseFloat(product.price.replace(/[^0-9.]/g, ''))) < 30))
    .slice(0, 4);

  const { addToCart } = useCart();

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, options);
    // Show a success message or notification
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Grid: Gallery and Info side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100">
                  <div className="text-center p-4">
                    <div className="text-6xl mb-4">🥃</div>
                    <div className="text-lg text-amber-700 font-medium">Whiskey</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info - Sticky on desktop */}
          <div className="product-info lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-6">
              {/* Vendor/Brand */}
              <div className="product-info__block-item">
                <Link 
                  href={`/collections/${product.brand.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-gray-500 hover:text-[#bd9a65] transition-colors font-medium"
                >
                  {product.distillery || product.brand}
                </Link>
              </div>

              {/* Product Title */}
              <div className="product-info__block-item">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="product-info__block-item">
                <div className="flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {product.price}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.regularPrice}
                      </span>
                      <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        SALE
                      </span>
                    </>
                  ) : product.price.includes('Save $') ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-red-600 font-semibold">
                        {product.price}
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                        See details
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Specs */}
              {(product.abv || product.volume) && (
                <div className="product-info__block-item flex gap-4 text-sm text-gray-600">
                  {product.abv && (
                    <div>
                      <span className="font-semibold">ABV: </span>
                      {product.abv}
                    </div>
                  )}
                  {product.volume && (
                    <div>
                      <span className="font-semibold">Volume: </span>
                      {product.volume}
                    </div>
                  )}
                </div>
              )}

              {/* Product Form */}
              <div className="shopify-product-form space-y-6">
                {/* Quantity Selector */}
                <div className="product-info__block-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <span className="text-lg">−</span>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-16 h-10 text-center border border-gray-300 rounded-md font-semibold"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <span className="text-lg">+</span>
                    </button>
                  </div>
                </div>

                {/* Product Options */}
                <div className="product-info__block-item border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.giftWrapping}
                        onChange={() => handleOptionChange('giftWrapping')}
                        className="w-4 h-4 text-[#bd9a65] border-gray-300 rounded focus:ring-[#bd9a65]"
                      />
                      <span className="ml-3 text-gray-700">
                        Gift Wrapping (+$5.99)
                      </span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.giftMessage}
                        onChange={() => handleOptionChange('giftMessage')}
                        className="w-4 h-4 text-[#bd9a65] border-gray-300 rounded focus:ring-[#bd9a65]"
                      />
                      <span className="ml-3 text-gray-700">
                        Add Gift Message (Free)
                      </span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.engraving}
                        onChange={() => handleOptionChange('engraving')}
                        className="w-4 h-4 text-[#bd9a65] border-gray-300 rounded focus:ring-[#bd9a65]"
                      />
                      <span className="ml-3 text-gray-700">
                        Custom Engraving (+$15.99)
                      </span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.insurance}
                        onChange={() => handleOptionChange('insurance')}
                        className="w-4 h-4 text-[#bd9a65] border-gray-300 rounded focus:ring-[#bd9a65]"
                      />
                      <span className="ml-3 text-gray-700">
                        Shipping Insurance (+$2.99)
                      </span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.expressShipping}
                        onChange={() => handleOptionChange('expressShipping')}
                        className="w-4 h-4 text-[#bd9a65] border-gray-300 rounded focus:ring-[#bd9a65]"
                      />
                      <span className="ml-3 text-gray-700">
                        Express Shipping (+$9.99)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="product-info__block-item">
                  <button 
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#bd9a65] hover:bg-[#a88955] text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
                  >
                    Add to cart
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This item is a recurring or deferred purchase. By continuing, I agree to the terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Content - Below the grid */}
        <div className="product-content border-t pt-12 space-y-4">

          {/* Description Accordion */}
          {product.description && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  Description
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    accordionOpen.description ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.description && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Highlights Accordion */}
          {product.highlights && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('highlights')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  Highlights
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    accordionOpen.highlights ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.highlights && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.highlights}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tasting Notes Accordion */}
          {product.tastingNotes && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('tastingNotes')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  Tasting Notes
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    accordionOpen.tastingNotes ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accordionOpen.tastingNotes && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.tastingNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

