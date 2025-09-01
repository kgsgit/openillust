// 파일 경로: src/app/categories/page.tsx

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';
import FilterBar from '@/components/FilterBar';

type Tag = {
  id: number;
  name: string;
};

type Illustration = {
  id: number;
  title: string;
  image_url: string;
};

type Collection = {
  id: number;
  name: string;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    tags?: string; 
    collection?: string; 
    sort?: string;
  }>;
}) {
  const { page, tags, collection, sort } = await searchParams;
  const currentPage = parseInt(page ?? '1', 10);
  const perPage = 40;
  const from = (currentPage - 1) * perPage;
  const to = currentPage * perPage - 1;

  // Load tags for filter
  const { data: tagData, error: tagsError } = await supabaseAdmin
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });
  if (tagsError) {
    throw new Error(`Failed to load categories: ${tagsError.message}`);
  }
  const allTags: Tag[] = tagData || [];

  // Load collections for filter
  const { data: collectionsData, error: collectionsError } = await supabaseAdmin
    .from('collections')
    .select('id, name')
    .order('name', { ascending: true });
  if (collectionsError) {
    throw new Error(`Failed to load collections: ${collectionsError.message}`);
  }
  const collections: Collection[] = collectionsData || [];

  // Build query with filters - 필수 필드만 로딩
  let query = supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url', { count: 'exact' })
    .eq('visible', true);

  // Apply tag filters
  if (tags) {
    const tagList = tags.split(',').map(t => t.trim());
    // Filter illustrations that have any of the selected tags
    query = query.overlaps('tags', tagList);
  }

  // Apply collection filter
  if (collection) {
    query = query.eq('collection_id', parseInt(collection, 10));
  }

  // Apply sorting
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'popular':
      query = query.order('download_count_svg', { ascending: false });
      break;
    case 'alphabetical':
      query = query.order('title', { ascending: true });
      break;
    default: // newest
      query = query.order('created_at', { ascending: false });
  }

  const { data: illData, error: illError, count } = await query.range(from, to);
  if (illError) {
    throw new Error(`Failed to load illustrations: ${illError.message}`);
  }
  const illustrations: Illustration[] = illData || [];
  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Illustrations</h1>

      {/* Filter Bar */}
      <FilterBar tags={allTags} collections={collections} />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {illustrations.length} of {totalItems} illustrations
          {tags && ` filtered by tags: ${tags.replace(/,/g, ', ')}`}
          {collection && ` in collection: ${collections.find(c => c.id.toString() === collection)?.name}`}
        </p>
      </div>

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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/categories?page=${currentPage - 1}${tags ? `&tags=${tags}` : ''}${collection ? `&collection=${collection}` : ''}${sort ? `&sort=${sort}` : ''}`}
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
              href={`/categories?page=${currentPage + 1}${tags ? `&tags=${tags}` : ''}${collection ? `&collection=${collection}` : ''}${sort ? `&sort=${sort}` : ''}`}
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
