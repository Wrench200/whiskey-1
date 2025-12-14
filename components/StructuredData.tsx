import { WhiskeyProduct } from '@/types/product';

interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'BreadcrumbList';
  data?: WhiskeyProduct | any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenbarrelwhiskey.com';

  const getOrganizationData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Golden Barrel Whiskey',
    url: baseUrl,
    logo: `${baseUrl}/Logo.png`,
    description: 'Premium whiskey store offering exceptional whiskeys, bourbons, scotch, and rare selections from around the world.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@goldenbarrelwhiskey.com',
    },
    sameAs: [
      // Add social media links when available
    ],
  });

  const getProductData = (product: WhiskeyProduct) => {
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const regularPrice = product.regularPrice ? parseFloat(product.regularPrice.replace(/[^0-9.]/g, '')) : null;
    const imageUrl = product.imageUrl?.startsWith('http') 
      ? product.imageUrl 
      : `${baseUrl}${product.imageUrl || '/Logo.png'}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} - ${product.brand}`,
      image: imageUrl,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/products/${product.id}`,
        priceCurrency: 'USD',
        price: price.toString(),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      ...(regularPrice && {
        aggregateRating: {
          '@type': 'AggregateRating',
          // You can add actual ratings when available
        },
      }),
    };
  };

  const getBreadcrumbData = (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  });

  let jsonLd: any;

  switch (type) {
    case 'Organization':
      jsonLd = getOrganizationData();
      break;
    case 'Product':
      if (data) {
        jsonLd = getProductData(data);
      }
      break;
    case 'BreadcrumbList':
      if (data) {
        jsonLd = getBreadcrumbData(data);
      }
      break;
  }

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

