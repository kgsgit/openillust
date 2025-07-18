// 파일 경로: src/app/collections/page.tsx

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export interface Collection {
  id: number;
  name: string;
  thumbnail_url: string | null;
  thumbnail2_url: string | null;
  description: string | null;
}

export default async function CollectionsPage() {
  // 서버 컴포넌트에서 supabaseAdmin을 사용해 데이터 직접 페칭
  const { data: collections, error } = await supabaseAdmin
    .from('collections')
    .select('id, name, thumbnail_url, thumbnail2_url, description')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`컬렉션 로드 실패: ${error.message}`);
  }

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '1rem' }}>
      <h1 className="text-3xl font-bold my-8">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections!.map(col => (
          <div
            key={col.id}
            className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-3 space-x-3">
              {col.thumbnail_url && (
                <img
                  src={col.thumbnail_url}
                  alt={`${col.name} 썸네일`}
                  className="h-8 w-8 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold">{col.name}</h2>
            </div>
            <Link href={`/collections/${col.id}`} className="block flex-1">
              <div
                className="relative w-full"
                style={{ paddingTop: '75%' }}
              >
                {col.thumbnail2_url ? (
                  <img
                    src={col.thumbnail2_url}
                    alt={`${col.name} 메인 이미지`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
            </Link>
            <div className="px-4 py-3 flex flex-col">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {col.description || '설명이 없습니다.'}
              </p>
              <Link
                href={`/collections/${col.id}`}
                className="mt-auto text-blue-600 hover:underline self-end"
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
