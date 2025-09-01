'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 에러 일러스트레이션 */}
        <div className="mb-8">
          <div className="text-8xl mb-4">💥</div>
          <div className="text-4xl font-bold text-red-800 mb-2">Oops!</div>
          <div className="text-xl text-red-600 mb-6">Something went wrong</div>
        </div>

        {/* 메시지 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            We encountered an error
          </h1>
          <p className="text-gray-600 mb-4">
            Don't worry, this happens sometimes. Our team has been notified and is working on it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-left text-sm text-gray-800">
              <strong>Error details:</strong><br />
              {error.message}
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🔄 Try Again
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              🏠 Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              🔃 Refresh Page
            </button>
          </div>
        </div>

        {/* 도움말 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>If this problem persists, please contact our support team.</p>
          <p className="mt-1">
            <a 
              href="/info/contact" 
              className="text-red-600 hover:text-red-700 underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}