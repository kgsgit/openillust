// 파일 경로: src/app/categories/[id]/page.tsx

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';

type Tag = { id: number; name: string };
type Illustration = { id: number; title: string; image_url: string };

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const tagId = parseInt(id, 10);
  const currentPage = parseInt(page ?? '1', 10);
  const perPage = 40;
  const from = (currentPage - 1) * perPage;
  const to = currentPage * perPage - 1;

  // 전체 태그 조회
  const { data: tags, error: tagsError } = await supabaseAdmin
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });
  if (tagsError) {
    throw new Error(`Failed to load categories: ${tagsError.message}`);
  }

  // 현재 태그 이름 조회
  const { data: tagRec, error: tagError } = await supabaseAdmin
    .from('tags')
    .select('name')
    .eq('id', tagId)
    .single();
  if (tagError || !tagRec) {
    throw new Error('Tag not found');
  }
  const tagName = tagRec.name;

  // 해당 태그 일러스트 페이징 조회
  const { data: illusData, error: illError, count } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url', { count: 'exact' })
    .eq('visible', true)
    .filter('tags', 'cs', JSON.stringify([tagName]))
    .order('created_at', { ascending: false })
    .range(from, to);
  if (illError) {
    throw new Error(`Failed to load illustrations: ${illError.message}`);
  }
  const illustrations: Illustration[] = illusData || [];
  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
      {/* 제목 */}
      <h1 className="text-3xl font-bold my-8">Categories</h1>

      {/* 태그 리스트 */}
      <ul className="flex flex-wrap gap-4 mb-8">
        <li>
          <Link
            href="/categories"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            All
          </Link>
        </li>
        {tags.map(t => (
          <li key={t.id}>
            <Link
              href={`/categories/${t.id}`}
              className={`px-3 py-1 rounded transition ${
                t.id === tagId
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* 선택된 태그 제목 */}
      <h2 className="text-2xl font-semibold mb-12">{tagName}</h2>

      {/* 일러스트 그리드 */}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/categories/${tagId}?page=${currentPage - 1}`}
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
              href={`/categories/${tagId}?page=${currentPage + 1}`}
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
