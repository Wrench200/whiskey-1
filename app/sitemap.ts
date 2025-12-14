import { MetadataRoute } from 'next';
import whiskeyProductsEnhanced from '@/data/whiskey-products-enhanced.json';
import { WhiskeyProduct } from '@/types/product';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenbarrelwhiskey.com';
  const products = whiskeyProductsEnhanced as WhiskeyProduct[];

  // Static routes
  const routes = [
    '',
    '/collections',
    '/collections/whiskey',
    '/best-sellers',
    '/about',
    '/contact',
    '/shipping',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Product pages
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes];
}

