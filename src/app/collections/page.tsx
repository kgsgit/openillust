// 파일 경로: src/app/collections/page.tsx
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import ThumbnailImage from '@/components/ThumbnailImage';

interface Collection {
  id: number;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  thumbnail2_url: string | null;
}

export default async function CollectionsPage() {
  // API 호출, 매 요청마다 최신 데이터
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/collections`, {
    cache: 'no-store',
  });
  const collections: Collection[] = await res.json();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {/* 썸네일 박스 (75% 비율 유지) */}
            <Link href={`/collections/${col.id}`}>
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: '75%' }}
              >
                {col.thumbnail2_url ? (
                  <ThumbnailImage
                    src={col.thumbnail2_url}
                    alt={`${col.name} 썸네일`}
                    ratio={75}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
            </Link>

            {/* 제목과 설명, View more 링크 */}
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
