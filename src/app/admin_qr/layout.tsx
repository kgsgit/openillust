'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

export default function AdminQrLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 로그인 페이지는 즉시 렌더링
    if (pathname === '/admin_qr/login') {
      setChecking(false);
      setIsAuthorized(true);
      return;
    }

    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // 세션 없음 - 즉시 로그인으로 리디렉션
        router.replace('/admin_qr/login');
        return;
      }

      // 세션이 있으면 승인된 것으로 간주 (미들웨어에서 이미 검증됨)
      setSession(session);
      setIsAuthorized(true);
      setChecking(false);
    });

    // 인증 상태 변경 리스너
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        setSession(null);
        setIsAuthorized(false);
        router.replace('/admin_qr/login');
      } else {
        setSession(session);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin_qr/logout', { method: 'POST' });
    setSession(null);
    router.replace('/admin_qr/login');
  };

  if (checking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {session && isAuthorized ? (
            <>
              <nav className="space-x-4">
                <Link href="/admin_qr" className="text-slate-600 hover:underline">
                  Dashboard
                </Link>
                <Link href="/admin_qr/collections" className="text-slate-600 hover:underline">
                  Collections
                </Link>
                <Link href="/admin_qr/tags" className="text-slate-600 hover:underline">
                  Tags
                </Link>
                <Link href="/admin_qr/settings" className="text-slate-600 hover:underline">
                  Settings
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/admin_qr/login" className="text-slate-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
