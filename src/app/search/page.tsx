// src/app/search/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';
import Link from 'next/link';
import SearchTracker from '@/components/SearchTracker';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  
  if (!query) {
    return {
      title: 'Search - OpenIllust',
      description: 'Search for free illustrations. 10 free downloads daily available.',
    };
  }

  return {
    title: `'${query}' search results - OpenIllust`,
    description: `Find '${query}' related free illustrations. High-quality illustrations for commercial use.`,
    openGraph: {
      title: `'${query}' search results - OpenIllust`,
      description: `Find '${query}' related free illustrations.`,
      url: `https://openillust.com/search?q=${encodeURIComponent(query)}`,
    },
  };
}

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  download_count_svg: number;
  download_count_png: number;
  created_at: string;
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>Please enter a search term.</p>
      </div>
    );
  }

  // 제목과 태그에서 검색
  const { data: illustrations, error } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, download_count_svg, download_count_png, created_at, tags')
    .eq('visible', true)
    .or(`title.ilike.%${query}%, tags.cs.["${query}"]`)
    .order('download_count_svg', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Search error:', error);
    return (
      <div className="text-center text-red-500 py-12">
        <p>An error occurred while searching.</p>
      </div>
    );
  }

  const results = illustrations || [];

  return (
    <div>
      <SearchTracker query={query} resultsCount={results.length} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search results for '{query}'
        </h1>
        <p className="text-gray-600">
          Found {results.length} illustration{results.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg mb-4">No search results found.</p>
          <p className="text-sm">Try searching with different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <Link key={item.id} href={`/illustration/${item.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <ThumbnailImage src={item.image_url} alt={item.title} />
                <div className="p-4">
                  <h2 className="text-sm font-medium mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  <div className="text-xs text-gray-500">
                    <span>{(item.download_count_svg + item.download_count_png).toLocaleString()} downloads</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
          <p>Searching...</p>
        </div>
      }>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

export const revalidate = 60;