'use client';

import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('@/components/Analytics'), { 
  ssr: false 
});

export default function AnalyticsWrapper() {
  return <Analytics />;
}