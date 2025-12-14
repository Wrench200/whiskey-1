export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Acceptance of Terms</h2>
            <p className="text-gray-700 font-light leading-relaxed">
              By accessing and using Golden Barrel Whiskey's website, you accept and agree to be bound 
              by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Age Verification</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              You must be of legal drinking age in your jurisdiction to purchase alcohol from our website. 
              By placing an order, you confirm that you meet the legal age requirements.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              We reserve the right to request proof of age and refuse service to anyone who cannot 
              provide valid identification.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Product Information</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However, 
              we do not warrant that product descriptions or other content on this site is accurate, 
              complete, reliable, current, or error-free.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              If a product is not as described, your sole remedy is to return it in unused condition.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Pricing and Payment</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              All prices are displayed in US dollars unless otherwise noted. We reserve the right 
              to change prices at any time without prior notice.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              Payment must be received before we ship your order. We accept major credit cards 
              and other payment methods as displayed at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Contact Us</h2>
            <p className="text-gray-700 font-light leading-relaxed">
              If you have questions about these Terms of Service, please contact us through our 
              <a href="/contact" className="text-red-600 hover:underline"> contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

