// 파일 경로: src/app/api/admin/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  const res = NextResponse.json({ success: true }, { status: 200 });

  // 쿠키 삭제: 객체 형식으로 인자 전달
  res.cookies.delete({
    name: 'sb-ooblqjwvjkldzazshjmw-auth-token',
    path: '/',
  });
  res.cookies.delete({
    name: 'sb-ooblqjwvjkldzazshjmw-refresh-token',
    path: '/',
  });

  return res;
}
