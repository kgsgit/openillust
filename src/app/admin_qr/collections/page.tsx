'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// 정적 생성 비활성화
export const dynamic = 'force-dynamic';

interface Collection {
  id: number;
  name: string;
  thumbnail_url: string | null;
  thumbnail2_url: string | null;
  description: string | null;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [name, setName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnail2Url, setThumbnail2Url] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Omit<Collection, 'id'>>({
    name: '',
    thumbnail_url: null,
    thumbnail2_url: null,
    description: null,
  });

  const fetchCollections = async () => {
    const res = await fetch('/api/admin_qr/collections');
    if (res.status === 401) {
      router.replace('/admin_qr/login');
      return;
    }
    if (!res.ok) {
      setError('컬렉션 목록을 불러오지 못했습니다.');
      return;
    }
    setCollections(await res.json());
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (collections.some(c => c.name === trimmed)) {
      setError('이미 존재하는 컬렉션입니다.');
      return;
    }
    setError(null);
    const res = await fetch('/api/admin_qr/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmed,
        thumbnail_url: thumbnailUrl || null,
        thumbnail2_url: thumbnail2Url || null,
        description: description || null,
      }),
    });
    if (res.status === 401) {
      router.replace('/admin_qr/login');
      return;
    }
    const created = await res.json();
    if (!res.ok) {
      setError(created.error || '생성 실패');
    } else {
      setName('');
      setThumbnailUrl('');
      setThumbnail2Url('');
      setDescription('');
      setCollections(prev => [created, ...prev]);
    }
  };

  const startEdit = (c: Collection) => {
    setEditingId(c.id);
    setEditFields({
      name: c.name,
      thumbnail_url: c.thumbnail_url,
      thumbnail2_url: c.thumbnail2_url,
      description: c.description,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const trimmed = editFields.name.trim();
    if (!trimmed) {
      setError('이름은 필수입니다.');
      return;
    }
    const res = await fetch(`/api/admin_qr/collections?id=${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFields),
    });
    if (res.status === 401) {
      router.replace('/admin_qr/login');
      return;
    }
    const updated = await res.json();
    if (!res.ok) {
      setError(updated.error || '수정 실패');
    } else {
      setEditingId(null);
      fetchCollections();
    }
  };

  const deleteOne = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin_qr/collections?id=${id}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      router.replace('/admin_qr/login');
      return;
    }
    if (!res.ok) {
      const r = await res.json();
      setError(r.error || '삭제 실패');
    } else {
      fetchCollections();
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">컬렉션 관리</h1>
      {error && <div className="text-red-600">{error}</div>}

      <form
        onSubmit={editingId ? saveEdit : handleCreate}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            이름<span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded px-2 py-1"
            value={editingId ? editFields.name : name}
            onChange={e =>
              editingId
                ? setEditFields(f => ({ ...f, name: e.target.value }))
                : setName(e.target.value)
            }
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">썸네일 URL</label>
          <input
            className="border rounded px-2 py-1"
            value={editingId ? (editFields.thumbnail_url || '') : thumbnailUrl}
            onChange={e =>
              editingId
                ? setEditFields(f => ({ ...f, thumbnail_url: e.target.value || null }))
                : setThumbnailUrl(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">썸네일2 URL</label>
          <input
            className="border rounded px-2 py-1"
            value={editingId ? (editFields.thumbnail2_url || '') : thumbnail2Url}
            onChange={e =>
              editingId
                ? setEditFields(f => ({ ...f, thumbnail2_url: e.target.value || null }))
                : setThumbnail2Url(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">설명</label>
          <input
            className="border rounded px-2 py-1"
            value={editingId ? (editFields.description || '') : description}
            onChange={e =>
              editingId
                ? setEditFields(f => ({ ...f, description: e.target.value || null }))
                : setDescription(e.target.value)
            }
          />
        </div>
        <div className="md:col-span-4 flex justify-end space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? '저장' : '생성'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">이름</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">썸네일1</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">썸네일2</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">설명</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {collections.map(c => (
              <tr key={c.id}>
                <td className="px-4 py-2 text-sm">{c.id}</td>
                <td className="px-4 py-2 text-sm">{c.name}</td>
                <td className="px-4 py-2">
                  {c.thumbnail_url && (
                    <img
                      src={c.thumbnail_url}
                      alt=""
                      className="h-8 w-8 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {c.thumbnail2_url && (
                    <img
                      src={c.thumbnail2_url}
                      alt=""
                      className="h-8 w-8 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-sm truncate max-w-xs">{c.description}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => startEdit(c)} className="text-blue-600 hover:underline">
                    수정
                  </button>
                  <button onClick={() => deleteOne(c.id)} className="text-red-600 hover:underline">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
