// src/app/api/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1) 쿼리 파라미터 파싱
  const url = new URL(request.url);
  const params = url.searchParams;
  const idParam = params.get('illustration');
  const fmt = (params.get('format') as 'svg' | 'png') ?? 'png';
  const mode = (params.get('mode') as 'signed' | 'stream') ?? 'signed';

  // 2) illustration ID 유효성 검사
  if (!idParam) {
    return NextResponse.json({ error: 'Illustration ID is required' }, { status: 400 });
  }
  const illustrationId = Number(idParam);
  if (isNaN(illustrationId)) {
    return NextResponse.json({ error: 'Invalid illustration ID' }, { status: 400 });
  }

  // 디버그 로그: IP 확인
  console.log('download request', {
    illustrationId,
    fmt,
    mode,
    ip: request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for'),
  });

  // 3) 사용자 식별자 쿠키 확인
  const userIdentifier = request.cookies.get('user_identifier')?.value;
  if (!userIdentifier) {
    return NextResponse.json({ error: 'User identifier missing' }, { status: 400 });
  }

  // 4) 클라이언트 IP 추출
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  // 5) IP별 일일 다운로드 횟수 확인
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: ipCount, error: ipError } = await supabaseAdmin
    .from('download_logs')
    .select('id', { head: true, count: 'exact' })
    .eq('illustration_id', illustrationId)
    .eq('ip_address', ip)
    .gte('created_at', todayStart.toISOString());
  if (ipError) {
    console.error('⚠️ IP count check error:', ipError);
  } else if ((ipCount ?? 0) >= 10) {
    return NextResponse.json({ error: 'IP download limit reached' }, { status: 403 });
  }

  // 6) 다운로드 카운트 증가 및 로그 삽입 (signed 모드일 때만)
  if (mode === 'signed') {
    const { error: cntError } = await supabaseAdmin.rpc('increment_download_count', {
      p_illustration_id: illustrationId,
      p_user_identifier: userIdentifier,
      p_download_type: fmt,
    });
    if (cntError) {
      console.error('⚠️ increment_download_count error:', cntError);
      return NextResponse.json({ error: cntError.message }, { status: 403 });
    }
    const { error: logError } = await supabaseAdmin
      .from('download_logs')
      .insert({
        illustration_id: illustrationId,
        user_identifier: userIdentifier,
        ip_address: ip,
        download_type: fmt,
      });
    if (logError) {
      console.error('⚠️ download_logs insert error:', logError);
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
  const path = illust.image_path!;
  const publicUrl = illust.image_url;

  // 8) 모드별 처리
  if (mode === 'signed') {
    const { data: signed, error: signError } = await supabaseAdmin
      .storage
      .from('illustrations-private')
      .createSignedUrl(path, 10);
    if (signError || !signed) {
      console.error('⚠️ createSignedUrl (short TTL) error:', signError);
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
      if (publicUrl) {
        return NextResponse.json({ url: publicUrl });
      }
      return NextResponse.json({ error: 'File not found in private bucket' }, { status: 404 });
    }
    const upstream = await fetch(signed2.signedUrl);
    if (!upstream.ok) {
      console.error('⚠️ upstream fetch error:', upstream.statusText);
      return NextResponse.json({ error: 'Failed to fetch file for streaming' }, { status: 502 });
    }
    const filename = path.split('/').pop() || `illustration.${fmt}`;
    const headers = new Headers(upstream.headers);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  }
}
