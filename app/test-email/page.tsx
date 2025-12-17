'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || data.error || 'Failed to send test email');
      }
    } catch (err) {
      setError('An error occurred while sending the test email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">Test Email Sending</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <form onSubmit={handleTest} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your-email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the email address where you want to receive the test email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Test Email...' : 'Send Test Email'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Test Email Sent Successfully!</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">SMTP Status:</p>
              <p className="text-gray-900">
                {result.smtpConfigured ? (
                  <span className="text-green-700">✓ Using configured SMTP</span>
                ) : (
                  <span className="text-yellow-700">⚠ Using Ethereal Email (Test Mode)</span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Customer Email:</p>
              <p className="text-gray-900">{result.customer.email}</p>
              {result.customer.previewUrl && (
                <a
                  href={result.customer.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm mt-1 inline-block"
                >
                  View Email Preview →
                </a>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Store Email:</p>
              <p className="text-gray-900">{result.store.email}</p>
              {result.store.previewUrl && (
                <a
                  href={result.store.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm mt-1 inline-block"
                >
                  View Email Preview →
                </a>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-gray-600">{result.note}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Instructions</h3>
        <p className="text-sm text-gray-700 mb-4">
          To use your own SMTP server, add these variables to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Golden Barrel Whiskey <noreply@goldenbarrelwhiskey.com>
STORE_EMAIL=orders@goldenbarrelwhiskey.com`}
        </pre>
        <p className="text-xs text-gray-600 mt-4">
          <strong>Note:</strong> For Gmail, you need to use an "App Password" instead of your regular password.
          Enable 2-factor authentication and generate an app password in your Google Account settings.
        </p>
      </div>
    </div>
  );
}


