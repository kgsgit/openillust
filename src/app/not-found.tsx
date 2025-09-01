import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 일러스트레이션 */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🎨</div>
          <div className="text-6xl font-bold text-slate-800 mb-2">404</div>
          <div className="text-xl text-slate-600 mb-6">Page Not Found</div>
        </div>

        {/* 메시지 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Oops! This page doesn't exist
          </h1>
          <p className="text-gray-600 mb-4">
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, let's get you back to discovering amazing illustrations!
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            🏠 Go to Homepage
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/categories"
              className="px-4 py-2 border-2 border-slate-600 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              🎯 Browse Categories
            </Link>
            <Link
              href="/popular"
              className="px-4 py-2 border-2 border-slate-600 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              🔥 Popular Items
            </Link>
          </div>
        </div>

        {/* 검색 제안 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>or try searching for something specific:</p>
          <div className="mt-2 flex">
            <input
              type="text"
              placeholder="Search illustrations..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const query = input.value;
                if (query.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-700 transition-colors"
            >
              🔍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '404 - Page Not Found | OpenIllust',
  description: 'The page you are looking for does not exist. Discover thousands of free illustrations instead.',
};