// 파일 경로: src/app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const revalidate = 60; // 60초마다 갱신

export async function GET() {
  // 1) DB에서 visible된 illustration ID 가져오기
  const { data: items, error } = await supabaseAdmin
    .from('illustrations')
    .select('id')
    .eq('visible', true);

  if (error) {
    return new NextResponse('Error generating sitemap', { status: 500 });
  }

  // 2) URL 목록 생성
  const domain = 'https://openillust.com';  // ← 실제 도메인으로 변경하세요
  const urls = [
    `<url><loc>${domain}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...items!.map(item =>
      `<url><loc>${domain}/illustration/${item.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    )
  ].join('');

  // 3) XML 포맷으로 리턴
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
