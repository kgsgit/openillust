// 파일 경로: src/app/api/admin/login/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message ?? 'Login failed' },
      { status: 401 }
    );
  }

  // 세션 토큰 추출
  const { access_token, refresh_token, expires_in } = data.session;

  // JSON 응답
  const res = NextResponse.json({ success: true }, { status: 200 });

  // access-token 쿠키 설정 (secure: true 추가)
  res.cookies.set({
    name: `sb-jtdmtrdqhefekqgfxnpf-auth-token`,
    value: JSON.stringify([
      access_token,
      data.session.token_type,
      expires_in,
      refresh_token,
      null,
      null,
      null
    ]),
    maxAge: expires_in,
    path: '/',
    sameSite: 'lax',
    secure: true
  });

  // refresh-token 쿠키 설정 (secure: true 추가)
  res.cookies.set({
    name: `sb-jtdmtrdqhefekqgfxnpf-refresh-token`,
    value: refresh_token,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10,
    path: '/',
    sameSite: 'lax',
    secure: true
  });

  return res;
}
