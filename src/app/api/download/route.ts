// src/app/api/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 파라미터 파싱
  const url = new URL(request.url);
  const params = url.searchParams;
  const idParam = params.get('illustration');
  const fmt = (params.get('format') as 'svg' | 'png') ?? 'png';
  const mode = (params.get('mode') as 'signed' | 'stream') ?? 'signed';

  if (!idParam) {
    return NextResponse.json({ error: 'Illustration ID is required' }, { status: 400 });
  }
  const illustrationId = Number(idParam);
  if (isNaN(illustrationId)) {
    return NextResponse.json({ error: 'Invalid illustration ID' }, { status: 400 });
  }

  // 디버그 로그
  console.log('download request params:', { illustrationId, fmt, mode });
  console.log('headers:', {
    nf: request.headers.get('x-nf-client-connection-ip'),
    real: request.headers.get('x-real-ip'),
    forwarded: request.headers.get('x-forwarded-for'),
  });

  // 사용자 식별자 쿠키 확인
  const userIdentifier = request.cookies.get('user_identifier')?.value;
  if (!userIdentifier) {
    return NextResponse.json({ error: 'User identifier missing' }, { status: 400 });
  }

  // 클라이언트 IP 추출 (Netlify 헤더 우선)
  const ip =
    request.headers.get('x-nf-client-connection-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  // 오늘자 IP별 다운로드 횟수 확인 (여전히 적용)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: ipCount, error: ipError } = await supabaseAdmin
    .from('download_logs')
    .select('id', { head: true, count: 'exact' })
    .eq('illustration_id', illustrationId)
    .eq('ip_address', ip)
    .gte('created_at', todayStart.toISOString());
  if (ipError) console.error('⚠️ IP count check error:', ipError);
  else if ((ipCount ?? 0) >= 10) {
    return NextResponse.json({ error: 'IP download limit reached' }, { status: 403 });
  }

  // signed 모드일 때만 RPC 호출 (로그 삽입 + 카운트)
  if (mode === 'signed') {
    const { error: cntError } = await supabaseAdmin.rpc('increment_download_count', {
      p_illustration_id: illustrationId,
      p_user_identifier: userIdentifier,
      p_download_type: fmt,
      p_ip_address: ip,
    });
    if (cntError) {
      console.error('⚠️ increment_download_count error:', cntError);
      return NextResponse.json({ error: cntError.message }, { status: 403 });
    }
  }

  // 일러스트 정보 조회
  const { data: illust, error: illError } = await supabaseAdmin
    .from('illustrations')
    .select('image_path, image_url')
    .eq('id', illustrationId)
    .single();
  if (illError || !illust) {
    return NextResponse.json({ error: illError?.message || 'Illustration not found' }, { status: 404 });
  }
  const path = illust.image_path!;
  const publicUrl = illust.image_url;

  // 파일 반환
  if (mode === 'signed') {
    const { data: signed, error: signError } = await supabaseAdmin
      .storage
      .from('illustrations-private')
      .createSignedUrl(path, 10);
    if (signError || !signed) {
      console.error('⚠️ createSignedUrl error:', signError);
      return NextResponse.json({ error: signError?.message || 'URL signing failed' }, { status: 500 });
    }
    return NextResponse.json({ url: signed.signedUrl });
  } else {
    const { data: signed2, error: signError2 } = await supabaseAdmin
      .storage
      .from('illustrations-private')
      .createSignedUrl(path, 300);
    if (signError2 || !signed2) {
      console.error('⚠️ createSignedUrl (stream) error:', signError2);
      if (publicUrl) return NextResponse.json({ url: publicUrl });
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const upstream = await fetch(signed2.signedUrl);
    if (!upstream.ok) {
      console.error('⚠️ upstream fetch error:', upstream.statusText);
      return NextResponse.json({ error: 'Failed to stream file' }, { status: 502 });
    }
    const filename = path.split('/').pop() || `illustration.${fmt}`;
    const headers = new Headers(upstream.headers);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    return new Response(upstream.body, { status: upstream.status, headers });
  }
}
