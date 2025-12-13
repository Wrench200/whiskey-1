'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500">
          <span className="hover:text-gray-900"><a href="/">Home</a></span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Contact</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Contact Us</h1>
        <p className="text-base text-gray-600 font-light max-w-2xl mx-auto">
          Have a question or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">Email</h3>
              <p className="text-gray-600 font-light">
                <a href="mailto:info@whiskeyfrontier.com" className="hover:text-gray-900 transition-colors">
                  info@whiskeyfrontier.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">Phone</h3>
              <p className="text-gray-600 font-light">
                <a href="tel:+1234567890" className="hover:text-gray-900 transition-colors">
                  +1 (234) 567-890
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">Hours</h3>
              <p className="text-gray-600 font-light">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

