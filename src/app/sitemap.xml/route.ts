import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type UrlEntry = {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string; // ✅ lastmod를 optional 속성으로 선언
};

export async function GET() {
  // DB에서 공개된 일러스트 가져오기
  const { data: illustrations } = await supabase
    .from('illustrations')
    .select('id, updated_at')
    .eq('visible', true);

  const today = new Date().toISOString();

  // 정적 페이지 목록 (lastmod 필드도 같이 넣어줌)
  const staticPages: UrlEntry[] = [
    { loc: 'https://openillust.com/', changefreq: 'daily', priority: '1.0', lastmod: today },
    { loc: 'https://openillust.com/popular', changefreq: 'daily', priority: '0.9', lastmod: today },
    { loc: 'https://openillust.com/categories', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: 'https://openillust.com/collections', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: 'https://openillust.com/info/about', changefreq: 'yearly', priority: '0.5', lastmod: today },
  ];

  // DB 기반 동적 페이지
  const dynamicPages: UrlEntry[] =
    illustrations?.map((illust) => ({
      loc: `https://openillust.com/illustration/${illust.id}`,
      lastmod: illust.updated_at ? new Date(illust.updated_at).toISOString() : today,
      changefreq: 'monthly',
      priority: '0.7',
    })) ?? [];

  const urls: UrlEntry[] = [...staticPages, ...dynamicPages];

  // XML 문자열 생성
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
