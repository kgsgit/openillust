// 파일 경로: src/app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const revalidate = 60; // 60초마다 갱신

export async function GET() {
  try {
    // 1) 일러스트 데이터
    const { data: items } = await supabaseAdmin
      .from('illustrations')
      .select('id, created_at')
      .eq('visible', true);

    // 2) 컬렉션 데이터
    const { data: collections } = await supabaseAdmin
      .from('collections')
      .select('id, created_at');

    // 3) 태그 데이터
    const { data: tags } = await supabaseAdmin
      .from('tags')
      .select('name, id');

    const domain = 'https://openillust.com';
    
    // 4) URL 목록 생성
    const urls = [
      // 메인 페이지들
      `<url><loc>${domain}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${domain}/categories</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/collections</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/popular</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${domain}/search</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      
      // 정보 페이지들
      `<url><loc>${domain}/info/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      `<url><loc>${domain}/info/policy</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
      `<url><loc>${domain}/info/terms</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
      `<url><loc>${domain}/info/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
      
      // 개별 일러스트 페이지들
      ...(items || []).map(item =>
        `<url><loc>${domain}/illustration/${item.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${new Date(item.created_at).toISOString()}</lastmod></url>`
      ),
      
      // 컬렉션 페이지들
      ...(collections || []).map(collection =>
        `<url><loc>${domain}/collections/${collection.id}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${new Date(collection.created_at).toISOString()}</lastmod></url>`
      ),
      
      // 태그 페이지들
      ...(tags || []).map(tag =>
        `<url><loc>${domain}/tags/${encodeURIComponent(tag.name)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      )
    ].join('');

    // 5) XML 포맷으로 리턴
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' }
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
