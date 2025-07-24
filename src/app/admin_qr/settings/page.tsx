// 파일 경로: src/app/admin_qr/settings/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (res.status === 401) {
          router.replace('/admin_qr/login');
          return Promise.reject('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        setBannerImageUrl(data.banner_image_url || '');
        setBannerLinkUrl(data.banner_link_url || '');
        setBannerEnabled(data.banner_enabled === 'true');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          banner_image_url: bannerImageUrl,
          banner_link_url: bannerLinkUrl,
          banner_enabled: bannerEnabled ? 'true' : 'false',
        }),
      });
      if (res.status === 401) {
        router.replace('/admin_qr/login');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage('설정이 저장되었습니다.');
    } catch {
      setMessage('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-10">로딩 중…</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="bannerImageUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            배너 이미지 URL
          </label>
          <input
            id="bannerImageUrl"
            type="text"
            value={bannerImageUrl}
            onChange={e => setBannerImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="bannerLinkUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            배너 링크 URL
          </label>
          <input
            id="bannerLinkUrl"
            type="text"
            value={bannerLinkUrl}
            onChange={e => setBannerLinkUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center">
          <input
            id="bannerEnabled"
            type="checkbox"
            checked={bannerEnabled}
            onChange={e => setBannerEnabled(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="bannerEnabled" className="ml-2 block text-sm text-gray-700">
            배너 노출
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? '저장 중…' : '저장'}
        </button>
      </form>
    </div>
);
}
