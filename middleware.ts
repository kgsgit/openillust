// 파일 경로: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지와 로그인 API는 통과
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login'
  ) {
    return NextResponse.next();
  }

  // /admin 및 /api/admin 접근 시 세션 체크
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin')
  ) {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
