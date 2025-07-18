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
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '1rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Images at Your Fingertips, Curated for Purpose</h1>
        <p>
          Openillust is not just a repository of images. We select only those you can actually use, without unnecessary repetition.
          Each illustration is chosen and refined according to rigorous criteria, aiming to be a quiet tool that doesn’t hinder your creativity.
          No complex requirements—just the images you need, ready to use.
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
