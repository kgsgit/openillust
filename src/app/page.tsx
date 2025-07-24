// 파일 경로: src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ThumbnailImage from '@/components/ThumbnailImage';
import Link from 'next/link';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export default function HomePage() {
  const [latest, setLatest] = useState<Illustration[]>([]);
  const [popular, setPopular] = useState<Illustration[]>([]);
  const [columns, setColumns] = useState<number>(4);

  // 데이터 페칭
  useEffect(() => {
    (async () => {
      // 최신 12개
      const { data: latestData, error: latestError } = await supabase
        .from('illustrations')
        .select('id, title, image_url, created_at')
        .eq('visible', true)
        .order('created_at', { ascending: false })
        .limit(12);
      if (latestData && !latestError) {
        setLatest(latestData);
      }

      // 인기 4개 (SVG 다운로드 기준)
      const { data: popularData, error: popularError } = await supabase
        .from('illustrations')
        .select('id, title, image_url, created_at, download_count_svg')
        .eq('visible', true)
        .order('download_count_svg', { ascending: false })
        .limit(4);
      if (popularData && !popularError) {
        setPopular(popularData);
      }
    })();
  }, []);

  // 반응형 컬럼 수 관리
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, []);

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
          Not just more images. Only the right ones.
        </h1>
        <p
          style={{
            maxWidth: '600px',
            margin: '1rem auto 0',
            fontSize: '1.125rem',
            color: '#4B5563',
          }}
        >
          No clutter—just ready-to-use illustrations, instantly.
        </p>
      </section>

      {/* 최신 3행 */}
      <section style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
          }}
        >
          {latest.map(item => (
            <Link href={`/illustration/${item.id}`} key={item.id}>
              <ThumbnailImage src={item.image_url} alt={item.title} />
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 1행 */}
      <section style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
          }}
        >
          {popular.map(item => (
            <Link href={`/illustration/${item.id}`} key={item.id}>
              <ThumbnailImage src={item.image_url} alt={item.title} />
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link
          href="/categories"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1f2937',
            color: '#ffffff',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          More
        </Link>
      </div>
    </main>
  );
}
