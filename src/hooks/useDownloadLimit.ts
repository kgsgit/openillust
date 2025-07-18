import { useState, useEffect, useCallback } from 'react';

const DAILY_LIMIT = 10;
const COOKIE_NAME = 'user_identifier';

// 1) user_identifier 쿠키가 없으면 생성
function ensureUserIdentifier() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  if (!match) {
    const id = crypto.randomUUID();
    document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }
}

export function useDownloadLimit(illustrationId: number) {
  const [remaining, setRemaining] = useState<number>(DAILY_LIMIT);

  useEffect(() => {
    ensureUserIdentifier();
    const today = new Date().toISOString().slice(0, 10);
    const key = `downloads_${today}`;
    const used = parseInt(localStorage.getItem(key) || '0', 10);
    setRemaining(DAILY_LIMIT - used);
  }, []);

  const recordDownload = useCallback(
    async (type: 'svg' | 'png') => {
      // 2) 서버에 로그 전송
      const res = await fetch('/api/download_logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          illustration_id: illustrationId,
          download_type: type,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Download failed');
      }

      // 3) 성공 시 로컬 카운트 차감
      const today = new Date().toISOString().slice(0, 10);
      const key = `downloads_${today}`;
      const prev = parseInt(localStorage.getItem(key) || '0', 10);
      const next = prev + 1;
      localStorage.setItem(key, next.toString());
      setRemaining(DAILY_LIMIT - next);

      return data;
    },
    [illustrationId]
  );

  return { remaining, recordDownload };
}
