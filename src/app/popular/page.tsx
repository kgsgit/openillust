// 파일 경로: src/app/popular/page.tsx

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ThumbnailImage from '@/components/ThumbnailImage';

type Illustration = {
  id: number;
  title: string;
  image_url: string;
  download_count_svg: number;
  download_count_png: number;
};

export default async function PopularPage() {
  // visible 필터 및 다운로드 수 기준 정렬하여 상위 20개 추출
  const { data, error } = await supabase
    .from('illustrations')
    .select('id, title, image_url, download_count_svg, download_count_png')
    .eq('visible', true)
    .order('download_count_svg', { ascending: false })
    .order('download_count_png', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to load popular illustrations: ${error.message}`);
  }

  const items: Illustration[] = data || [];

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '1.5rem 2.5rem' }}>
      <h1 style={{ margin: '1rem 0 3rem' }} className="text-3xl font-bold">
        Popular Illustrations
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.length > 0 ? (
          items.map(item => (
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
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            등록된 인기 이미지가 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}
