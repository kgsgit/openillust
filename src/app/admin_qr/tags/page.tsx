'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Tag {
  id: number;
  name: string;
}

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 관리자용 태그 목록 불러오기
  const fetchTags = async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin_qr/tags');
      if (res.status === 401) {
        router.replace('/admin_qr/login');
        return;
      }
      if (!res.ok) throw new Error('태그 목록을 불러오는 데 실패했습니다.');
      const data: Tag[] = await res.json();
      setTags(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // 태그 생성
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (!name) return;

    // 중복 확인
    if (tags.some(t => t.name === name)) {
      setError('이미 존재하는 태그입니다.');
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/admin_qr/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.status === 401) {
        router.replace('/admin_qr/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '태그 생성에 실패했습니다.');

      setNewTag('');
      setTags(prev => [data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 태그 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setError(null);
    try {
      const res = await fetch(`/api/admin_qr/tags/${id}`, {
        method: 'DELETE',
      });
      if (res.status === 401) {
        router.replace('/admin_qr/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '태그 삭제에 실패했습니다.');

      fetchTags();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>태그 관리</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="새 태그명"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          required
        />
        <button type="submit">생성</button>
      </form>

      <ul>
        {tags.map(t => (
          <li key={t.id} style={{ marginBottom: '0.5rem' }}>
            {t.name} ({t.id})
            <button
              onClick={() => handleDelete(t.id)}
              style={{ marginLeft: '0.5rem' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
