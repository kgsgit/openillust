// 파일 경로: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지와 로그인 API는 통과
  if (
    pathname === '/admin_qr/login' ||
    pathname === '/api/admin_qr/login'
  ) {
    return NextResponse.next();
  }

  // /admin_qr 및 /api/admin_qr 접근 시 세션 체크
  if (
    pathname === '/admin_qr' ||
    pathname.startsWith('/admin_qr/') ||
    pathname.startsWith('/api/admin_qr/')
  ) {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin_qr/login';
      return NextResponse.redirect(loginUrl);
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin_qr',
    '/admin_qr/:path*',
    '/api/admin_qr/:path*',
  ],
};
