'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
      // 비로그인 상태로 /admin_qr 경로 접근 시 로그인으로 리디렉션
      if (!session && pathname.startsWith('/admin_qr')) {
        router.replace('/admin_qr/login');
      }
    });

    // 인증 상태 변경 리스너
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
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

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {session ? (
            <>
              <nav className="space-x-4">
                <Link href="/admin_qr" className="text-blue-600 hover:underline">
                  Dashboard
                </Link>
                <Link href="/admin_qr/collections" className="text-blue-600 hover:underline">
                  Collections
                </Link>
                <Link href="/admin_qr/tags" className="text-blue-600 hover:underline">
                  Tags
                </Link>
                <Link href="/admin_qr/settings" className="text-blue-600 hover:underline">
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
            <Link href="/admin_qr/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
