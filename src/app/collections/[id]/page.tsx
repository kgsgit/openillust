// 파일 경로: src/app/collections/[id]/page.tsx

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ThumbnailImage from '@/components/ThumbnailImage';

type Collection = {
  id: number;
  name: string;
  thumbnail_url: string | null;
  description: string | null;
};

type Illustration = {
  id: number;
  title: string;
  image_url: string;
};

export default async function CollectionDetailPage(input: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await input.params;
  const { page } = await input.searchParams;

  const collectionId = parseInt(id, 10);
  const currentPage = parseInt(page ?? '1', 10);
  const perPage = 8;
  const from = (currentPage - 1) * perPage;
  const to = currentPage * perPage - 1;

  const { data: colData, error: colError } = await supabase
    .from('collections')
    .select('id, name, thumbnail_url, description')
    .eq('id', collectionId)
    .single();
  if (colError || !colData) {
    throw new Error(colError?.message || '컬렉션을 찾을 수 없습니다.');
  }
  const collection: Collection = colData;

  const { data: illData, error: illError, count } = await supabase
    .from('illustrations')
    .select('id, title, image_url', { count: 'exact' })
    .eq('collection_id', collectionId)
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (illError) {
    throw new Error(illError.message);
  }
  const illustrations: Illustration[] = illData || [];
  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
      <h1 className="text-3xl font-bold my-8">Collections</h1>

      <div className="flex items-center space-x-4 mb-8">
        {collection.thumbnail_url && (
          <div className="w-12 h-12 overflow-hidden rounded">
            <ThumbnailImage
              src={collection.thumbnail_url}
              alt={collection.name}
            />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold mb-1">{collection.name}</h2>
          {collection.description && (
            <p className="text-gray-600">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {illustrations.map(ill => (
          <Link
            key={ill.id}
            href={`/illustration/${ill.id}`}
            className="block overflow-hidden rounded"
          >
            <ThumbnailImage src={ill.image_url} alt={ill.title} />
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium">{ill.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4">
          {currentPage > 1 && (
            <Link
              href={`/collections/${collectionId}?page=${currentPage - 1}`}
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
              href={`/collections/${collectionId}?page=${currentPage + 1}`}
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
