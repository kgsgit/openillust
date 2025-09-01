// 파일 경로: src/app/page.tsx

// ISR 재검증 주기 설정 (초 단위)
export const revalidate = 60;

import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import ThumbnailImage from '@/components/ThumbnailImage';
import Link from 'next/link';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  download_count_svg: number;
  download_count_png: number;
}

export default async function HomePage() {
  // 서버 사이드에서 데이터 가져오기
  const { data: latestData } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, created_at, download_count_svg, download_count_png')
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(12);
  const latest: Illustration[] = latestData ?? [];

  const { data: popularData } = await supabaseAdmin
    .from('illustrations')
    .select('id, title, image_url, created_at, download_count_svg, download_count_png')
    .eq('visible', true)
    .order('download_count_svg', { ascending: false })
    .limit(8);
  const popular: Illustration[] = popularData ?? [];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="text-center mb-12">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl px-8 py-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Download instantly, no signup required
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            10 free downloads daily • Commercial use allowed
          </p>
          <div className="flex justify-center items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              Free downloads
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              Commercial use OK
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              No signup needed
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-600">{latest.length}</div>
            <div className="text-sm text-gray-600">Latest illustrations</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">{popular.reduce((sum, item) => sum + item.download_count_svg + item.download_count_png, 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total downloads</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">Daily</div>
            <div className="text-sm text-gray-600">Free downloads</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">10</div>
            <div className="text-sm text-gray-600">Daily limit</div>
          </div>
        </div>
      </section>

      {/* Latest illustrations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🆕 Latest Illustrations</h2>
          <Link href="/categories" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latest.map(item => (
            <Link key={item.id} href={`/illustration/${item.id}`}>
              <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <ThumbnailImage src={item.image_url} alt={item.title} />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                      Download →
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular illustrations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 Popular Illustrations</h2>
          <Link href="/popular" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popular.map((item, index) => (
            <Link key={item.id} href={`/illustration/${item.id}`}>
              <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <ThumbnailImage src={item.image_url} alt={item.title} />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    #{index + 1}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                      Download →
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>📥 {(item.download_count_svg + item.download_count_png).toLocaleString()}회</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Looking for more illustrations?</h2>
        <p className="text-gray-600 mb-6">Browse thousands of free illustrations organized by categories.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categories"
            className="inline-block px-8 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            View all categories
          </Link>
          <Link
            href="/collections"
            className="inline-block px-8 py-3 border-2 border-slate-600 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Browse collections
          </Link>
        </div>
      </section>
    </main>
  );
}