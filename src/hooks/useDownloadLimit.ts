// src/hooks/useDownloadLimit.ts

import { useState, useEffect } from 'react';

const DAILY_LIMIT = 10;
const COOKIE_NAME = 'user_identifier';

function ensureUserIdentifier() {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`)
  );
  if (!match) {
    const id = crypto.randomUUID();
    document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
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

  const incrementLocalCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `downloads_${today}`;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    const next = prev + 1;
    localStorage.setItem(key, next.toString());
    setRemaining(DAILY_LIMIT - next);
  };

  return { remaining, incrementLocalCount };
}
