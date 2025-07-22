// 파일 경로: src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import IllustrationCard from '@/components/IllustrationCard';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export default function HomePage() {
  const [items, setItems] = useState<Illustration[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('illustrations')
        .select('id, title, image_url, created_at')
        .eq('visible', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) setItems(data);
    })();
  }, []);

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '4rem' }}>
    <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
  <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
   Not just more images. Only the right ones.
  </h1>
  <p style={{ maxWidth: '600px', margin: '1rem auto 0', fontSize: '1.125rem', color: '#4B5563' }}>
    No clutter—just ready-to-use illustrations, instantly.
  </p>
</section>

      <section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {items.map(item => (
            <IllustrationCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.image_url}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
