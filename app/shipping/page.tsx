export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">Shipping and Returns</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Shipping Information</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We offer fast and secure shipping to ensure your premium whiskey arrives safely. 
              Standard shipping typically takes 5-7 business days.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              Express shipping options are available at checkout for faster delivery.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Returns Policy</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              please contact us within 30 days of receipt.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              Due to the nature of our products, returns are handled on a case-by-case basis. 
              Please contact our customer service team for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Contact Us</h2>
            <p className="text-gray-700 font-light leading-relaxed">
              For questions about shipping or returns, please visit our <a href="/contact" className="text-red-600 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

