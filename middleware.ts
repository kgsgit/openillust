// 파일 경로: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const { pathname, protocol } = req.nextUrl;

  // 1. Production 환경에서 HTTPS 강제
  if (process.env.NODE_ENV === 'production' && protocol !== 'https:') {
    const secureUrl = req.nextUrl.clone();
    secureUrl.protocol = 'https:';
    return NextResponse.redirect(secureUrl);
  }

  // 2. 로그인 페이지 및 API 호출은 통과
  if (
    pathname === '/admin_qr/login' ||
    pathname === '/api/admin_qr/login'
  ) {
    return NextResponse.next();
  }

  // 3. /admin_qr 및 관련 API 경로 접근 시
  if (
    pathname === '/admin_qr' ||
    pathname.startsWith('/admin_qr/') ||
    pathname.startsWith('/api/admin_qr')
  ) {
    const res = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient({ req, res });

    // 3-1. 세션 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin_qr/login';
      return NextResponse.redirect(loginUrl);
    }

    // 3-2. 사용자 검증 (환경변수 ADMIN_EMAIL과 비교)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // 3-3. 보안 헤더 추가
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    res.headers.set(
      'Content-Security-Policy',
      "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self';"
    );

    return res;
  }

  // 4. 그 외 경로는 그대로 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin_qr',
    '/admin_qr/:path*',
    '/api/admin_qr/:path*',
    '/sitemap.xml', // ✅ 사이트맵 추가
  ],
};
