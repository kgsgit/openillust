// 파일: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 로그인 페이지와 로그인 API는 예외
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login'
  ) {
    return res;
  }

  // /admin 및 /api/admin 접근 시 인증 체크 (settings 는 제외)
  if (
    (pathname.startsWith('/admin') ||
     pathname.startsWith('/api/admin')) &&
    !session
  ) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// settings 관련 경로는 전부 미들웨어 적용 대상에서 뺐습니다
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
