import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Barrel Whiskey - Premium Whiskey Store",
  description: "Crafted to Perfection - Delivered with Care. Browse our collection of premium whiskeys, bourbons, scotch, and rare selections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-white">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
