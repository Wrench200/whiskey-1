import { WhiskeyProduct } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: WhiskeyProduct[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      {title && (
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-light text-gray-900 tracking-tight">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

