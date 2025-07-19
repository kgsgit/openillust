'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Settings {
  banner_enabled?: string;
  banner_image_url?: string;
  banner_link_url?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then((data: Settings) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    alert('설정이 저장되었습니다.');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="container mx-auto max-w-screen-lg px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">관리자 설정</h1>
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </form>
    </main>
  );
}
