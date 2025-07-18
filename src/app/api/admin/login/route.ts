// 파일 경로: src/app/api/admin/login/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? 'Login failed' }, { status: 401 });
  }

  // 세션에서 토큰 꺼내기
  const { access_token, refresh_token, expires_in } = data.session;

  // 리다이렉트 응답 생성
  const res = NextResponse.redirect(new URL('/admin', request.url));

  // access-token 쿠키 (기존 helper가 내려주는 것과 중복되지 않도록 확인)
  res.cookies.set({
    name: `sb-jtdmtrdqhefekqgfxnpf-auth-token`,
    value: JSON.stringify([access_token, data.session.token_type, expires_in, refresh_token, null, null, null]),
    maxAge: expires_in,
    path: '/',
    sameSite: 'lax',
  });

  // refresh-token 쿠키 (HttpOnly)
  res.cookies.set({
    name: `sb-jtdmtrdqhefekqgfxnpf-refresh-token`,
    value: refresh_token,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10,
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
