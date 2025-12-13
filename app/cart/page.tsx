'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const total = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cart</h1>
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-[#bd9a65] hover:bg-[#a88955] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
              const optionsPrice = item.selectedOptions
                ? (item.selectedOptions.giftWrapping ? 5.99 : 0) +
                (item.selectedOptions.engraving ? 15.99 : 0) +
                (item.selectedOptions.insurance ? 2.99 : 0) +
                (item.selectedOptions.expressShipping ? 9.99 : 0)
                : 0;
              const totalItemPrice = (itemPrice + optionsPrice) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                >
                  {/* Product Image */}
                  {item.imageUrl && (
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                    </Link>
                  )}

                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-[#bd9a65] transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{item.brand}</p>

                    {/* Selected Options */}
                    {item.selectedOptions && (
                      <div className="text-xs text-gray-600 mb-2">
                        {item.selectedOptions.giftWrapping && <div>Gift Wrapping (+$5.99)</div>}
                        {item.selectedOptions.giftMessage && <div>Gift Message</div>}
                        {item.selectedOptions.engraving && <div>Custom Engraving (+$15.99)</div>}
                        {item.selectedOptions.insurance && <div>Shipping Insurance (+$2.99)</div>}
                        {item.selectedOptions.expressShipping && <div>Express Shipping (+$9.99)</div>}
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <span className="text-lg">−</span>
                      </button>
                      <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <span className="text-lg">+</span>
                      </button>
                      <span className="text-lg font-bold text-gray-900 ml-4">
                        ${totalItemPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="mt-6 text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-[#bd9a65] hover:bg-[#a88955] text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200 mb-4"
            >
              Place Order
            </Link>

            <Link
              href="/"
              className="block w-full text-center text-gray-700 hover:text-[#bd9a65] font-medium transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
}

