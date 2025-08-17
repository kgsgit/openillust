// 파일 경로: src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient'; // 서버용 Admin 클라이언트(읽기 전용)
                                                          // 없다면 supabase 클라이언트를 import해서 사용하세요.

const BASE_URL = 'https://openillust.com';

// ISO 형식으로 변환 (yyyy-mm-dd)
function toISODate(d: string | Date | null | undefined) {
  try {
    const dt = d ? new Date(d) : new Date();
    return dt.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// XML escape
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function GET() {
  try {
    // 1) 고정 페이지들
    const staticUrls = [
      { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0', lastmod: new Date() },
      { loc: `${BASE_URL}/popular`, changefreq: 'daily', priority: '0.9', lastmod: new Date() },
      { loc: `${BASE_URL}/categories`, changefreq: 'weekly', priority: '0.8', lastmod: new Date() },
      { loc: `${BASE_URL}/collections`, changefreq: 'weekly', priority: '0.8', lastmod: new Date() },
      { loc: `${BASE_URL}/info/about`, changefreq: 'monthly', priority: '0.6', lastmod: new Date() },
    ];

    // 2) 일러스트 상세 페이지들 (visible = true)
    const { data, error } = await supabaseAdmin
      .from('illustrations')
      .select('id, updated_at, created_at')
      .eq('visible', true)
      .order('id', { ascending: true })
      .limit(50000); // 안전 상한

    if (error) {
      // 실패 시에도 최소한 고정 URL만 반환
      console.error('Sitemap Supabase error:', error.message);
    }

    const dynamicUrls =
      (data ?? []).map((row: any) => ({
        loc: `${BASE_URL}/illustration/${row.id}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: row.updated_at || row.created_at || new Date(),
      })) || [];

    // 3) XML 조립 (불순 태그 없이 순수 XML만 반환)
    const urls = [...staticUrls, ...dynamicUrls];

    const xmlItems = urls
      .map(
        (u) => `
  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${esc(toISODate(u.lastmod))}</lastmod>
    <changefreq>${esc(u.changefreq)}</changefreq>
    <priority>${esc(u.priority)}</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`.trim();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        // 캐시를 원하시면 아래 주석 해제 (예: 1시간)
        // 'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (e: any) {
    console.error('Sitemap fatal error:', e?.message || e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
