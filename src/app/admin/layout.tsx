'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 클라이언트 사이드에서 세션 검증 후 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
      }
    });
  }, [supabase, router]);

  const handleLogout = async () => {
    // 서버에 로그아웃 요청 (HTTP-only 쿠키 만료)
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="space-x-4">
            <Link href="/admin" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/collections" className="text-blue-600 hover:underline">
              Collections
            </Link>
            <Link href="/admin/tags" className="text-blue-600 hover:underline">
              Tags
            </Link>
            <Link href="/admin/settings" className="text-blue-600 hover:underline">
              Settings
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
