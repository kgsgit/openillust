// 파일 경로: src/app/api/settings/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // — 공개 읽기: 세션 검사 없이 settings 테이블에서 key/value 조회
  const supabaseServer = createRouteHandlerClient({ cookies });
  const { data, error } = await supabaseServer
    .from('settings')
    .select('key, value');

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const settings = Object.fromEntries(
    data.map(item => [item.key, item.value])
  );
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  // — 쓰기(업데이트)만 인증: 세션 없으면 401
  const supabaseServer = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = (await request.json()) as Record<string, string>;
  const entries = Object.entries(body).map(([key, value]) => ({ key, value }));

  const { error } = await supabaseServer
    .from('settings')
    .upsert(entries, { onConflict: 'key' });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
