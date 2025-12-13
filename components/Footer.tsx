import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/Logo.png"
                alt="Golden Barrel Whiskey"
                width={150}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 font-light">
              Crafted to Perfection - Delivered with Care
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium mb-4 text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors font-light">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors font-light">
                  Shipping and Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors font-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors font-light">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium mb-4 text-white uppercase tracking-wider">About</h4>
            <p className="text-sm text-gray-400 font-light">
              Golden Barrel Whiskey is a leading online retailer offering the services of alcohol delivery at your doorstep.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 font-light">© 2025 - Golden Barrel Whiskey</p>
        </div>
      </div>
    </footer>
  );
}

