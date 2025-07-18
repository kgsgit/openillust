'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import IllustrationCard from '@/components/IllustrationCard';
import { supabase } from '@/lib/supabaseClient';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
}

export default function TagDetailPage() {
  const params = useSearchParams();
  const tag = params.get('tag');
  const [items, setItems] = useState<Illustration[]>([]);

  useEffect(() => {
    if (!tag) return;
    (async () => {
      const { data, error } = await supabase
        .from('illustrations')
        .select('id, title, image_url, created_at')
        .contains('tags', [tag])
        .order('created_at', { ascending: false });
      if (!error && data) setItems(data);
    })();
  }, [tag]);

  if (!tag) return <div>Tag is missing.</div>;
  if (items.length === 0) return <div>Loading...</div>;

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '1rem' }}>
      <h1>Tag: {tag}</h1>
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
    </main>
  );
}
