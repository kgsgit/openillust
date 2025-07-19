'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Settings {
  banner_enabled?: string;
  banner_image_url?: string;
  banner_link_url?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 관리자용 세팅 불러오기
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('설정을 불러올 수 없습니다.');
      const data: Settings = await res.json();
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 입력 변경 처리
  const handleChange =
    (key: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === 'checkbox'
          ? e.target.checked
            ? 'true'
            : 'false'
          : e.target.value;
      setSettings(prev => ({ ...prev, [key]: value }));
    };

  // 세팅 저장
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || '설정 저장에 실패했습니다.');
      }
      alert('설정이 저장되었습니다.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="container mx-auto max-w-screen-lg px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">관리자 설정</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <label className="mr-2">배너 노출</label>
          <input
            type="checkbox"
            checked={settings.banner_enabled === 'true'}
            onChange={handleChange('banner_enabled')}
          />
        </div>
        <div>
          <label className="block mb-1">배너 이미지 URL</label>
          <input
            type="text"
            value={settings.banner_image_url || ''}
            onChange={handleChange('banner_image_url')}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">배너 링크 URL</label>
          <input
            type="text"
            value={settings.banner_link_url || ''}
            onChange={handleChange('banner_link_url')}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </form>
    </main>
  );
}
