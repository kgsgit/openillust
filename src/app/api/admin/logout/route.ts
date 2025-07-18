// 파일 경로: src/app/api/admin/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  // Supabase 서버 로그아웃 (세션 무효화)
  await supabase.auth.signOut();

  // 로그아웃 후 리다이렉트 응답 생성
  const redirectUrl = new URL('/admin/login', request.url);
  const res = NextResponse.redirect(redirectUrl);

  // HTTP-only 쿠키 (토큰) 삭제
  res.cookies.delete('sb-jtdmtrdqhefekqgfxnpf-auth-token');
  res.cookies.delete('sb-jtdmtrdqhefekqgfxnpf-refresh-token');

  return res;
}
