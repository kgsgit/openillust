// 파일 경로: src/app/collections/page.tsx

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';

export interface Collection {
  id: number;
  name: string;
  thumbnail2_url: string | null;
  description: string | null;
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
    .select('id, name, thumbnail2_url, description')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`컬렉션 로드 실패: ${error.message}`);
  }

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-8">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections!.map((col) => (
          <div
            key={col.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {/* 썸네일 이미지 박스 */}
            <Link href={`/collections/${col.id}`} className="block">
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: '70%'}}
              >
                {col.thumbnail2_url ? (
                  <ThumbnailImage
                    src={toCdnUrl(col.thumbnail2_url)}
                    alt={`${col.name} 썸네일`}
                    ratio={65}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
            </Link>

            {/* 제목 및 링크 */}
            <div className="px-4 py-3">
              <h2 className="text-lg font-semibold mb-2">{col.name}</h2>
              <Link
                href={`/collections/${col.id}`}
                className="text-blue-600 hover:underline text-sm"
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
