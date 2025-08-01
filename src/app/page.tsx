// ① ISR 설정: 60초마다 페이지 갱신
export const revalidate = 60;

import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';
import Link from 'next/link';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export default async function HomePage() {
  const { data: latestData } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, created_at')
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(12);
  const latest: Illustration[] = latestData ?? [];

  const { data: popularData } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, created_at')
    .eq('visible', true)
    .order('download_count_svg', { ascending: false })
    .limit(8);
  const popular: Illustration[] = popularData ?? [];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <section className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          Not just more images. Only the right ones.
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          No clutter—just ready-to-use illustrations, instantly.
        </p>
      </section>

      {/* 최신 일러스트 */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map(item => (
            <Link key={item.id} href={`/illustration/${item.id}`}>
              <ThumbnailImage src={item.image_url} alt={item.title} />
              <h2 className="mt-2 text-center text-base font-medium">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 일러스트 */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map(item => (
            <Link key={item.id} href={`/illustration/${item.id}`}>
              <ThumbnailImage src={item.image_url} alt={item.title} />
              <h2 className="mt-2 text-center text-base font-medium">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/categories"
          className="inline-block px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          More
        </Link>
      </div>
    </main>
);
}
