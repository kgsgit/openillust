import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // 1) user_identifier를 쿠키에서 추출
  const cookie = request.cookies.get('user_identifier');
  const user_identifier = cookie?.value;

  // 2) 요청 바디 파싱
  const { illustration_id, download_type } = await request.json();

  // 3) 필수 값 검증
  if (!illustration_id || !user_identifier || !download_type) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // 4) 클라이언트 IP 추출
  const xff = request.headers.get('x-forwarded-for');
  const ip = Array.isArray(xff) ? xff[0] : xff || 'unknown';

  // 5) 오늘 00:00 ~ 내일 00:00 범위 계산
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // 6) 오늘자 다운로드 횟수 조회 (식별자 또는 IP 기준)
  const { count, error: countError } = await supabase
    .from('download_logs')
    .select('id', { count: 'exact', head: true })
    .or(`user_identifier.eq.${user_identifier},ip_address.eq.${ip}`)
    .gte('created_at', startISO)
    .lt('created_at', endISO);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }
  if ((count ?? 0) >= 10) {
    return NextResponse.json(
      { error: '오늘 다운로드 한도(10회)를 모두 사용하셨습니다.' },
      { status: 429 }
    );
  }

  // 7) 제한 통과 시 로그 삽입
  const { error: insertError } = await supabase
    .from('download_logs')
    .insert([{ illustration_id, user_identifier, download_type, ip_address: ip }]);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 8) illustrations 테이블 현재 카운트 조회
  const column = download_type === 'svg' ? 'download_count_svg' : 'download_count_png';
  const { data: illust, error: illustError } = await supabase
    .from('illustrations')
    .select(column)
    .eq('id', illustration_id)
    .single();
  if (illustError || !illust) {
    return NextResponse.json(
      { error: illustError?.message || 'Illustration not found' },
      { status: 500 }
    );
  }

  // 9) illustrations 테이블 카운트 갱신
  const currentCount = (illust as Record<string, number>)[column] || 0;
  const newCount = currentCount + 1;
  const { error: updateError } = await supabase
    .from('illustrations')
    .update({ [column]: newCount })
    .eq('id', illustration_id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 10) 성공 응답
  return NextResponse.json({ success: true }, { status: 200 });
}
