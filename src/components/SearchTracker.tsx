'use client';

import { useEffect } from 'react';
import { trackSearch } from '@/components/Analytics';

interface SearchTrackerProps {
  query: string;
  resultsCount: number;
}

export default function SearchTracker({ query, resultsCount }: SearchTrackerProps) {
  useEffect(() => {
    if (query.trim()) {
      trackSearch(query, resultsCount);
    }
  }, [query, resultsCount]);

  return null;
}