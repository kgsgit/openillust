'use client';                                  // 1) 반드시 최상단
export const dynamic = 'force-dynamic';        // 2) 클라이언트 전용 강제 렌더링
n// 정적 생성 비활성화
export const dynamic = 'force-dynamic';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';  // Suspense 임포트 추가

interface Collection {
  id: number;
  name: string;
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}

function SearchParamsComponent() {
  const router = useRouter();  // useRouter()를 여기로 이동
  const params = useSearchParams();
  const id = params.get('id');

  // 기본 필드 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  // 컬렉션 관련 상태
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  // 태그 관련 상태
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');

  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    (async () => {
      // 1) 컬렉션 목록 (관리자용)
      const colRes = await fetch('/api/admin_qr/collections', { credentials: 'include' });
      if (colRes.ok) setCollections(await colRes.json());

      // 2) 태그 목록 (관리자용)
      const tagRes = await fetch('/api/admin_qr/tags', { credentials: 'include' });
      if (tagRes.ok) {
        const tags: { id: number; name: string }[] = await tagRes.json();
        setTagsList(tags.map(t => t.name));
      }

      // 3) 수정 모드: 기존 일러스트 데이터
      if (id) {
        const recRes = await fetch(`/api/illustrations/${id}`);
        if (recRes.ok) {
          const rec = await recRes.json();
          setTitle(rec.title);
          setDescription(rec.description || '');
          setCollectionId(String(rec.collection_id));
          setSelectedTags(rec.tags || []);
          setVisible(rec.visible ?? true);
        } else {
          setError('기존 데이터를 불러오는 데 실패했습니다.');
        }
      }
    })();
  }, [id]);

  // 새 컬렉션 생성
  const handleCreateCollection = async () => {
    const name = newCollectionName.trim();
    if (!name) return;
    if (collections.some(c => c.name === name)) {
      setError('이미 존재하는 컬렉션입니다.');
      return;
    }
    setError(null);
    const res = await fetch('/api/admin_qr/collections', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const created = await res.json();
    if (!res.ok) {
      setError(created.error || '컬렉션 생성 실패');
      return;
    }
    setCollections(prev => [...prev, created]);
    setCollectionId(String(created.id));
    setNewCollectionName('');
  };

  // 새 태그 생성
  const handleCreateTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    if (tagsList.includes(name)) {
      setError('이미 존재하는 태그입니다.');
      return;
    }
    setError(null);
    const res = await fetch('/api/admin_qr/tags', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const created: { id: number; name: string } = await res.json();
    if (!res.ok) {
      setError((created as any).error || '태그 생성 실패');
      return;
    }
    setTagsList(prev => [...prev, created.name]);
    setSelectedTags(prev => [...prev, created.name]);
    setNewTagName('');
  };

  // 폼 제출 (등록/수정)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !collectionId) {
      setError('제목과 컬렉션은 필수입니다.');
      return;
    }
    const form = new FormData();
    form.append('title', title.trim());
    form.append('description', description.trim());
    form.append('collection_id', collectionId);
    form.append('tags', JSON.stringify(selectedTags));
    form.append('visible', visible.toString());
    if (file) form.append('file', file);

    const url = `/api/admin_qr/upload${id ? `?replaceId=${id}` : ''}`;
    const method = id ? 'PATCH' : 'POST';

    const res = await fetch(url, { method, credentials: 'include', body: form });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error || '업로드 요청에 실패했습니다.');
    } else {
      router.push('/admin_qr');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">
        {id ? '이미지 수정' : '새 이미지 등록'}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div>
          <label className="block font-medium">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block font-medium">설명</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* 컬렉션 선택 + 생성 */}
        <div>
          <label className="block font-medium">
            컬렉션 <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={collectionId}
            onChange={e => setCollectionId(e.target.value)}
            required
          >
            <option value="">선택하세요</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="새 컬렉션 이름"
              value={newCollectionName}
              onChange={e => setNewCollectionName(e.target.value)}
            />
            <button
              type="button"
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              onClick={handleCreateCollection}
            >
              생성
            </button>
          </div>
        </div>

        {/* 태그 선택 + 생성 */}
        <div>
          <label className="block font-medium">태그</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {tagsList.map(name => (
              <label key={name} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  value={name}
                  checked={selectedTags.includes(name)}
                  onChange={e => {
                    const v = e.target.value;
                    setSelectedTags(prev =>
                      prev.includes(v)
                        ? prev.filter(x => x !== v)
                        : [...prev, v]
                    );
                  }}
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="새 태그 이름"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              onClick={handleCreateTag}
            >
              태그 추가
            </button>
          </div>
        </div>

        {/* visible 토글 */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={visible}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVisible(e.target.checked)
              }
            />
            <span>노출하기</span>
          </label>
        </div>

        {/* 이미지 파일 */}
        <div>
          <label className="block font-medium">
            파일 {id ? '(선택 시 교체)' : ''}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files?.[0] || null)
            }
            className="mt-1"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {id ? '수정하기' : '등록하기'}
        </button>
      </form>
    </div>
  );
}
