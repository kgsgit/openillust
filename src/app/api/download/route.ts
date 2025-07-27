// src/app/api/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1) 파라미터 파싱
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

  // 2) 디버그 로그
  console.log('download request params:', { illustrationId, fmt, mode });
  console.log('headers:', {
    nf: request.headers.get('x-nf-client-connection-ip'),
    real: request.headers.get('x-real-ip'),
    forwarded: request.headers.get('x-forwarded-for'),
  });

  // 3) 사용자 식별자 쿠키 확인
  const userIdentifier = request.cookies.get('user_identifier')?.value;
  if (!userIdentifier) {
    return NextResponse.json({ error: 'User identifier missing' }, { status: 400 });
  }

  // 4) 클라이언트 IP 추출 (Netlify 헤더 우선)
  const ip =
    request.headers.get('x-nf-client-connection-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  // 5) 오늘자 IP별 전체 다운로드 횟수 확인(10회 초과 시 차단)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data: logs, count: ipCount, error: ipError } = await supabaseAdmin
    .from('download_logs')
    .select('id', { count: 'exact' })
    .eq('ip_address', ip)
    .gte('created_at', todayStart.toISOString());

  if (ipError) {
    console.error('⚠️ IP count check error:', ipError);
  } else {
    console.log(`⚙️ [IP Block] ${ip} has downloaded total ${ipCount} times today`);
    if ((ipCount ?? 0) >= 10) {
      return NextResponse.json({ error: 'IP download limit reached' }, { status: 403 });
    }
  }

  // 6) signed 모드일 때만 RPC 호출 (로그 삽입 + 카운트 증가)
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

  // 7) 일러스트 정보 조회
  const { data: illust, error: illError } = await supabaseAdmin
    .from('illustrations')
    .select('image_path, image_url')
    .eq('id', illustrationId)
    .single();
  if (illError || !illust) {
    return NextResponse.json({ error: illError?.message || 'Illustration not found' }, { status: 404 });
  }
  const origPath = illust.image_path!;
  const publicUrl = illust.image_url;

  // 8) 항상 SVG 원본 경로 사용 할것
  const requestedPath = origPath;

  // 9) 파일 반환
  if (mode === 'signed') {
    const { data: signed, error: signError } = await supabaseAdmin
      .storage
      .from('illustrations-private')
      .createSignedUrl(requestedPath, 10);
    if (signError || !signed) {
      console.error('⚠️ createSignedUrl error:', signError);
      return NextResponse.json({ error: 'URL signing failed' }, { status: 500 });
    }
    return NextResponse.json({ url: signed.signedUrl });
  } else {
    const { data: signed2, error: signError2 } = await supabaseAdmin
      .storage
      .from('illustrations-private')
      .createSignedUrl(requestedPath, 300);
    if (signError2 || !signed2) {
      console.error('⚠️ createSignedUrl (stream) error:', signError2);
      return NextResponse.json({ url: publicUrl });
    }
    const upstream = await fetch(signed2.signedUrl);
    if (!upstream.ok) {
      console.error('⚠️ upstream fetch error:', upstream.statusText);
      return NextResponse.json({ error: 'Failed to stream file' }, { status: 502 });
    }
    const filename = requestedPath.split('/').pop()!;
    const headers = new Headers(upstream.headers);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    return new Response(upstream.body, { status: upstream.status, headers });
  }
}
