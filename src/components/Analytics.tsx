'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-J0QHBDLF6F', {
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// Analytics helper functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackDownload = (illustrationId: number, format: 'svg' | 'png', title: string) => {
  trackEvent('download', {
    event_category: 'engagement',
    event_label: `${title} (${format})`,
    illustration_id: illustrationId,
    file_format: format,
  });
};

export const trackSearch = (query: string, results: number) => {
  trackEvent('search', {
    search_term: query,
    results_count: results,
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
  });
};