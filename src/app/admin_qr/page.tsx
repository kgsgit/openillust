'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Illustration {
  id: number;
  title: string;
  image_url: string;
  download_count_svg: number;
  download_count_png: number;
  created_at: string;
  collection_id: number;
  tags: string[] | null;
}

interface Collection {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<Illustration[]>([]);
  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);

  const [searchTitle, setSearchTitle] = useState('');
  const [filterCollection, setFilterCollection] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    | 'created_desc'
    | 'created_asc'
    | 'svg_desc'
    | 'png_desc'
    | 'collection_asc'
    | 'collection_desc'
  >('created_desc');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    let query = supabase
      .from('illustrations')
      .select(`
        id,
        title,
        image_url,
        download_count_svg,
        download_count_png,
        created_at,
        collection_id,
        tags
      `);

    if (searchTitle) {
      query = query.ilike('title', `%${searchTitle}%`);
    }
    if (filterCollection) {
      query = query.eq('collection_id', parseInt(filterCollection, 10));
    }
    if (filterTag) {
      query = query.filter('tags', 'cs', JSON.stringify([filterTag]));
    }

    switch (sortBy) {
      case 'created_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'svg_desc':
        query = query.order('download_count_svg', { ascending: false });
        break;
      case 'png_desc':
        query = query.order('download_count_png', { ascending: false });
        break;
      case 'collection_asc':
        query = query.order('collection_id', { ascending: true });
        break;
      case 'collection_desc':
        query = query.order('collection_id', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const from = (page - 1) * perPage;
    const to = page * perPage - 1;
    const { data, error } = await query.range(from, to);

    if (error) {
      console.error('Fetch illustrations error:', error.message);
    } else if (data) {
      setItems(data);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: cols } = await supabase
        .from('collections')
        .select('id,name')
        .order('name', { ascending: true });
      setCollectionsList(cols || []);

      const { data: tags } = await supabase
        .from('tags')
        .select('name')
        .order('name', { ascending: true });
      setTagsList((tags || []).map((t) => t.name));
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchTitle, filterCollection, filterTag, sortBy, perPage, page]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin_qr/upload?deleteId=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || '삭제 실패');
      fetchData();
    } catch (err: any) {
      alert(`삭제 중 오류: ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search title..."
          value={searchTitle}
          onChange={(e) => { setPage(1); setSearchTitle(e.target.value); }}
          className="border px-2 py-1 rounded flex-grow"
        />

        <select
          value={filterCollection}
          onChange={(e) => { setPage(1); setFilterCollection(e.target.value); }}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Collections</option>
          {collectionsList.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterTag}
          onChange={(e) => { setPage(1); setFilterTag(e.target.value); }}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Tags</option>
          {tagsList.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="created_desc">Created (Newest)</option>
          <option value="created_asc">Created (Oldest)</option>
          <option value="svg_desc">SVG Downloads ↓</option>
          <option value="png_desc">PNG Downloads ↓</option>
          <option value="collection_asc">Collection A→Z</option>
          <option value="collection_desc">Collection Z→A</option>
        </select>

        <select
          value={perPage}
          onChange={(e) => { setPage(1); setPerPage(+e.target.value); }}
          className="border px-2 py-1 rounded"
        >
          {[10, 20, 30, 40, 50].map((n) => (
            <option key={n} value={n}>{n} rows</option>
          ))}
        </select>

        <button
          onClick={() => (window.location.href = '/admin_qr/upload')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Upload
        </button>
      </div>

      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Thumb</th>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Collection</th>
            <th className="border px-2 py-1">Tags</th>
            <th className="border px-2 py-1">SVG</th>
            <th className="border px-2 py-1">PNG</th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1 w-20">
                <img src={item.image_url || '/placeholder.png'} alt={item.title} className="w-full h-auto" />
              </td>
              <td className="border px-2 py-1">{item.id}</td>
              <td className="border px-2 py-1">{item.title}</td>
              <td className="border px-2 py-1">
                {collectionsList.find((c) => c.id === item.collection_id)?.name || '-'}
              </td>
              <td className="border px-2 py-1">
                {item.tags?.join(', ') ?? '-'}
              </td>
              <td className="border px-2 py-1">{item.download_count_svg}</td>
              <td className="border px-2 py-1">{item.download_count_png}</td>
              <td className="border px-2 py-1">{new Date(item.created_at).toLocaleString()}</td>
              <td className="border px-2 py-1">
                <Link href={`/admin_qr/upload?id=${item.id}`} className="mr-2 text-blue-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={items.length < perPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
