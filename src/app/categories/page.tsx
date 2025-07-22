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
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page ?? '1', 10);
  const perPage = 40;
  const from = (currentPage - 1) * perPage;
  const to = currentPage * perPage - 1;

  const { data: tagData, error: tagsError } = await supabaseAdmin
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });
  if (tagsError) {
    throw new Error(`Failed to load categories: ${tagsError.message}`);
  }
  const tags: Tag[] = tagData || [];

  const { data: illData, error: illError, count } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url', { count: 'exact' })
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (illError) {
    throw new Error(`Failed to load illustrations: ${illError.message}`);
  }
  const illustrations: Illustration[] = illData || [];
  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '0.5rem 3rem' }}>
      <h1 className="text-3xl font-bold my-8">Categories</h1>

      <ul className="flex flex-wrap gap-4 mb-8">
        <li>
          <Link
            href="/categories"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            All
          </Link>
        </li>
        {tags.map(tag => (
          <li key={tag.id}>
            <Link
              href={`/categories/${tag.id}`}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
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
              href={`/categories?page=${currentPage - 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              ‹ 이전
            </Link>
          )}
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/categories?page=${currentPage + 1}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              다음 ›
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
