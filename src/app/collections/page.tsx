// 파일 경로: src/app/collections/page.tsx
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  thumbnail2_url: string | null;
}

// null-safe CDN URL 변환 함수
function toCdnUrl(raw?: string | null): string {
  if (!raw) return '';
  const m = raw.match(/public\/illustrations\/images\/(.+)$/);
  return m ? `/cdn/illustrations/images/${m[1]}` : raw;
}

export default async function CollectionsPage() {
  const { data: collections, error } = await supabaseAdmin
    .from('collections')
    .select('id, name, description, thumbnail2_url')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`컬렉션 로드 실패: ${error.message}`);
  }

  return (
    <main className="max-w-5xl mx-auto p-6 pt-10">
      {/* 이제 상단 네비부터 충분한 여유가 생깁니다 */}
      <h1 className="text-3xl font-bold mb-6">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <Link href={`/collections/${col.id}`}>
              {col.thumbnail2_url && (
                <ThumbnailImage
                  src={toCdnUrl(col.thumbnail2_url)}
                  alt={`${col.name} 썸네일`}
                  ratio={75}
                />
              )}
            </Link>
            <div className="px-4 py-3">
              <h2 className="text-lg font-semibold">{col.name}</h2>
              {col.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {col.description}
                </p>
              )}
              <Link
                href={`/collections/${col.id}`}
                className="inline-block mt-3 text-blue-600 hover:underline text-sm"
              >
                View more &gt;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
