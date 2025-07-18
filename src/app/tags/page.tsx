'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Tag {
  id: number;
  name: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('created_at', { ascending: false });
      if (!error && data) setTags(data);
    })();
  }, []);

  if (tags.length === 0) return <div>Loading...</div>;

  return (
    <main style={{ maxWidth: 1200, margin: 'auto', padding: '1rem' }}>
      <h1>Tags</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {tags.map(tag => (
          <li key={tag.id}>
            <Link
              href={`/tags/${tag.name}?tag=${encodeURIComponent(tag.name)}`}
              style={{ textDecoration: 'none', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: 4 }}
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
