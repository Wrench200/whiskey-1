export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Information We Collect</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We collect information that you provide directly to us when you make a purchase, 
              create an account, or contact us for support.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              This includes your name, email address, shipping address, payment information, 
              and any other information you choose to provide.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">How We Use Your Information</h2>
            <p className="text-gray-700 font-light leading-relaxed mb-4">
              We use the information we collect to process your orders, communicate with you about 
              your purchases, and provide customer support.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              We may also use your information to send you promotional communications, 
              but you can opt out at any time.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Data Security</h2>
            <p className="text-gray-700 font-light leading-relaxed">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Contact Us</h2>
            <p className="text-gray-700 font-light leading-relaxed">
              If you have questions about this Privacy Policy, please contact us through our 
              <a href="/contact" className="text-red-600 hover:underline"> contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

