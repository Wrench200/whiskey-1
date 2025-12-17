import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AOSProvider from "@/components/AOSProvider";
import StructuredData from "@/components/StructuredData";
import Script from 'next/script';

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenbarrelwhiskey.com'),
  title: {
    default: "Golden Barrel Whiskey - Premium Whiskey Store",
    template: "%s | Golden Barrel Whiskey"
  },
  description: "Crafted to Perfection - Delivered with Care. Browse our collection of premium whiskeys, bourbons, scotch, and rare selections. Shop rare bourbon, scotch, Japanese whiskey, and more.",
  keywords: ["whiskey", "bourbon", "scotch", "premium whiskey", "rare whiskey", "whiskey store", "whiskey delivery", "Irish whiskey", "Japanese whiskey", "Canadian whiskey"],
  authors: [{ name: "Golden Barrel Whiskey" }],
  creator: "Golden Barrel Whiskey",
  publisher: "Golden Barrel Whiskey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Golden Barrel Whiskey",
    title: "Golden Barrel Whiskey - Premium Whiskey Store",
    description: "Crafted to Perfection - Delivered with Care. Browse our collection of premium whiskeys, bourbons, scotch, and rare selections.",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Golden Barrel Whiskey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Barrel Whiskey - Premium Whiskey Store",
    description: "Crafted to Perfection - Delivered with Care. Browse our collection of premium whiskeys, bourbons, scotch, and rare selections.",
    images: ["/Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="Organization" />
      </head>
      <body
        className={`${jost.variable} antialiased`}
      >
        <AOSProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen bg-white">
        {children}
            </main>
            <Footer />
          </CartProvider>
        </AOSProvider>
        <Script id="chatway" async={true} src="https://cdn.chatway.app/widget.js?id=fAYRFypvpx7t"></Script>
      </body>
    </html>
  );
}
