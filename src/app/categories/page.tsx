// 파일 경로: src/app/categories/page.tsx

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';

type Tag = {
  id: number;
  name: string;
};

type Illustration = {
  id: number;
  title: string;
  image_url: string;
  tags?: string[] | null;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    tag?: string;
    page?: string; 
  }>;
}) {
  const { tag, page } = await searchParams;
  const currentPage = parseInt(page ?? '1', 10);
  const perPage = 40;

  // Load all tags
  const { data: tagData, error: tagsError } = await supabaseAdmin
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });
  if (tagsError) {
    throw new Error(`Failed to load categories: ${tagsError.message}`);
  }
  const allTags: Tag[] = tagData || [];

  // Load all illustrations (we'll filter client-side)
  const { data: illData, error: illError } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, tags')
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (illError) {
    throw new Error(`Failed to load illustrations: ${illError.message}`);
  }
  const allIllustrations: Illustration[] = illData || [];
  
  // Client-side filtering by tag
  let filteredIllustrations = allIllustrations;
  if (tag) {
    filteredIllustrations = allIllustrations.filter(ill => {
      if (!ill.tags) return false;
      if (Array.isArray(ill.tags)) {
        return ill.tags.includes(tag);
      }
      // If tags is a string, try to parse as JSON
      if (typeof ill.tags === 'string') {
        try {
          const parsedTags = JSON.parse(ill.tags);
          return Array.isArray(parsedTags) && parsedTags.includes(tag);
        } catch {
          return false;
        }
      }
      return false;
    });
  }
  
  // Apply pagination to filtered results
  const totalItems = filteredIllustrations.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const from = (currentPage - 1) * perPage;
  const to = currentPage * perPage;
  const illustrations = filteredIllustrations.slice(from, to);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {/* Tag Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/categories"
            className={`px-4 py-2 rounded-full border transition-all ${
              !tag
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            All
          </Link>
          {allTags.map(tagItem => (
            <Link
              key={tagItem.id}
              href={`/categories?tag=${encodeURIComponent(tagItem.name)}`}
              className={`px-4 py-2 rounded-full border transition-all ${
                tag === tagItem.name
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {tagItem.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Current Category */}
      {tag && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">'{tag}' illustrations</h2>
          <p className="text-gray-600">Showing {illustrations.length} illustrations</p>
        </div>
      )}

      {!tag && (
        <div className="mb-6">
          <p className="text-gray-600">Showing {illustrations.length} of {totalItems} illustrations</p>
        </div>
      )}

      {/* Illustrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {illustrations.map(item => (
          <Link
            href={`/illustration/${item.id}`}
            key={item.id}
            className="block"
          >
            <ThumbnailImage src={item.image_url} alt={item.title} />
            <div className="mt-2 text-center">
              <h2 className="text-sm font-medium">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/categories?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}page=${currentPage - 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              ← Previous
            </Link>
          )}
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/categories?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}page=${currentPage + 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
