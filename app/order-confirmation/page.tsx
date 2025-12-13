'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-2 font-light">
          Thank you for your order
        </p>
        {orderId && (
          <p className="text-lg text-gray-500 mb-8 font-light">
            Order ID: <span className="font-medium text-gray-900">{orderId}</span>
          </p>
        )}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <p className="text-gray-700 font-light mb-4">
            We've sent a confirmation email to your email address with your order details.
          </p>
          <p className="text-gray-700 font-light">
            Our team will process your order and send you a shipping confirmation once it's on its way.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/collections"
            className="inline-block border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

