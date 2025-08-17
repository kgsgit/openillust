import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const revalidate = 60;             // 60초마다 재생성 (ISR)
export const dynamic = 'force-dynamic';   // 캐시 이슈 방지(원하면 유지)

const DOMAIN = 'https://openillust.com';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const toISO = (d?: string | Date | null) => {
  try { return (d ? new Date(d) : new Date()).toISOString(); }
  catch { return new Date().toISOString(); }
};

export async function GET() {
  // 1) DB
  const { data, error } = await supabaseAdmin
    .from('illustrations')
    .select('id, updated_at, created_at')
    .eq('visible', true)
    .order('id', { ascending: true });

  // 2) 기본 URL들
  const baseNow = new Date();
  const staticUrls = [
    { loc: `${DOMAIN}/`,            lastmod: baseNow, changefreq: 'daily',   priority: '1.0' },
    { loc: `${DOMAIN}/popular`,     lastmod: baseNow, changefreq: 'daily',   priority: '0.9' },
    { loc: `${DOMAIN}/categories`,  lastmod: baseNow, changefreq: 'weekly',  priority: '0.8' },
    { loc: `${DOMAIN}/collections`, lastmod: baseNow, changefreq: 'weekly',  priority: '0.8' },
    { loc: `${DOMAIN}/info/about`,  lastmod: baseNow, changefreq: 'monthly', priority: '0.6' },
  ];

  const dynamicUrls = (data ?? []).map(row => ({
    loc: `${DOMAIN}/illustration/${row.id}`,
    lastmod: row.updated_at || row.created_at || baseNow,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const urls = [...staticUrls, ...dynamicUrls];

  // 3) XML
  const xmlItems = urls.map(u => `
  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${esc(toISO(u.lastmod))}</lastmod>
    <changefreq>${esc(u.changefreq)}</changefreq>
    <priority>${esc(u.priority)}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`.trim();

  if (error) {
    // DB 오류가 있어도 최소한 기본 URL은 반환되게 할 수도 있음.
    // 지금은 그대로 XML을 반환(위에서 data ?? [] 처리)하므로 별도 500 리턴 불필요.
    console.error('sitemap supabase error:', error.message);
  }

  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=UTF-8' }
  });
}
