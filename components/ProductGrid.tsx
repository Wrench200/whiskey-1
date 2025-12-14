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
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <div key={product.id} data-aos="fade-up" data-aos-delay={index % 5 * 100}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

