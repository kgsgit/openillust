// 파일 경로: src/app/api/admin/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  const res = NextResponse.json({ success: true }, { status: 200 });

  // Supabase auth-helpers-nextjs 가 생성한 모든 쿠키 삭제
  res.cookies.delete({ name: 'sb-jtdmtrdqhefekqgfxnpf-auth-token', path: '/' });
  res.cookies.delete({ name: 'sb-jtdmtrdqhefekqgfxnpf-refresh-token', path: '/' });
  res.cookies.delete({ name: 'sb-ooblqjwvjkldzazshjmw-auth-token', path: '/' });
  res.cookies.delete({ name: 'sb-ooblqjwvjkldzazshjmw-refresh-token', path: '/' });
  res.cookies.delete({ name: 'sb-refresh-token', path: '/' });
  res.cookies.delete({ name: 'user_identifier', path: '/' });

  return res;
}
