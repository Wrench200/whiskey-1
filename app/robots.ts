import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenbarrelwhiskey.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart', '/checkout', '/order-confirmation'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

