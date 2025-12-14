'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WhiskeyProduct } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Plus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: WhiskeyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.regularPrice !== null && product.regularPrice !== '';
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <div className="group relative flex flex-col bg-white">
      <div className="relative w-full aspect-square bg-white overflow-hidden mb-6">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain group-hover:opacity-95 transition-opacity duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🥃</div>
                <div className="text-xs text-gray-400 font-normal">Whiskey</div>
              </div>
            </div>
          )}
        </Link>
        
        {/* Discount Badge on Image */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded z-10">
            SALE
          </div>
        )}
        
        {/* Add to Cart Button Overlay on Image (Desktop only) */}
        <div className="hidden md:flex absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-95 transition-all duration-200 items-center justify-center opacity-0 group-hover:opacity-100 z-10">
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 hover:bg-gray-800 cursor-pointer text-white font-medium py-2.5 px-8 rounded-md transition-all duration-200 text-sm transform translate-y-2 group-hover:translate-y-0"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col grow">
        {/* Brand/Vendor */}
        <div className="text-xs text-gray-400 mb-2 font-normal uppercase tracking-wider">
          {product.brand}
        </div>
        
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-normal text-gray-900 mb-4 line-clamp-2 min-h-10 hover:text-gray-600 transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>
        
        {/* Price and Add to Cart (Mobile) */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-gray-900">{product.price}</span>
                <span className="text-xs md:text-sm text-red-600 line-through">{product.regularPrice}</span>
              </div>
            ) : (
              <span className="text-base font-medium text-gray-900">{product.price}</span>
            )}
          </div>
          
          {/* Add to Cart Button (Mobile only) */}
          <button
            onClick={handleAddToCart}
            className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-md transition-colors flex items-center justify-center"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5" />
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

