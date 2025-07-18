'use client';
import React, { useEffect, useState } from 'react';

interface Settings {
  banner_enabled?: string;
  banner_image_url?: string;
  banner_link_url?: string;
}

export default function Banner() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Settings) => setSettings(data))
      .catch(console.error);
  }, []);

  if (settings.banner_enabled !== 'true') return null;

  return (
    <div style={{ width: '100%', margin: '1rem 0', padding: '0.5rem', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', textAlign: 'center', boxSizing: 'border-box' }}>
      {settings.banner_image_url && (
        <img src={settings.banner_image_url} alt="Banner" style={{ width: '100%', height: 'auto', marginBottom: '0.5rem', display: 'block' }} />
      )}
      {settings.banner_link_url && (
        <a href={settings.banner_link_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: '100%', padding: '0.5rem 1rem', backgroundColor: '#f0ad4e', color: '#fff', borderRadius: '4px', textDecoration: 'none', boxSizing: 'border-box' }}>
          무제한 다운로드 구매하기
        </a>
      )}
    </div>
  );
}
