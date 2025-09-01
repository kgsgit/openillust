// src/components/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ThemeToggle from './ThemeToggle';

interface Collection {
  id: number;
  name: string;
  thumbnail_url: string | null;
}

export default function Header() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);
  let startX = 0;

  useEffect(() => {
    // 로컬스토리지에서 캐싱된 컬렉션 확인
    const cached = localStorage.getItem('collections_cache');
    const cacheTime = localStorage.getItem('collections_cache_time');
    const now = Date.now();
    
    if (cached && cacheTime && now - parseInt(cacheTime) < 300000) { // 5분 캐시
      setCollections(JSON.parse(cached));
      return;
    }
    
    (async () => {
      const { data } = await supabase
        .from('collections')
        .select('id, name, thumbnail_url')
        .order('created_at', { ascending: false })
        .limit(10); // 최대 10개로 제한
      
      if (data) {
        setCollections(data);
        localStorage.setItem('collections_cache', JSON.stringify(data));
        localStorage.setItem('collections_cache_time', now.toString());
      }
    })();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const step = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 30) scroll('left');
    else if (startX - endX > 30) scroll('right');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        {/* 로고 */}
        <Link href="/" className="flex-shrink-0 mr-4">
          <img src="/logo.png" alt="Openillust" className="h-8 w-auto object-contain" />
        </Link>

        {/* 컬렉션 슬라이더 */}
        <div className="relative w-2/5 min-w-0 flex items-center">
          <button
            onClick={() => scroll('left')}
            className="flex-shrink-0 px-1 text-gray-500 hover:text-gray-800 z-10"
            aria-label="이전 컬렉션"
          >
            ‹
          </button>
          <div
            ref={sliderRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex flex-nowrap gap-2 overflow-x-auto hide-scrollbar flex-1 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {collections.map(c => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="flex-shrink-0 snap-center text-center p-1 max-[460px]:w-full w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
              >
                <img
                  src={c.thumbnail_url || '/placeholder.png'}
                  alt={c.name}
                  className="mx-auto h-16 w-16 object-cover rounded"
                />
                <div className="mt-1 text-xs sm:text-sm truncate">{c.name}</div>
              </Link>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="flex-shrink-0 px-1 text-gray-500 hover:text-gray-800 z-10"
            aria-label="다음 컬렉션"
          >
            ›
          </button>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="block md:hidden flex-shrink-0 ml-4 p-2 flex flex-col justify-between h-8 touch-manipulation"
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* 검색 바 */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search illustrations..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              🔍
            </button>
          </div>
        </form>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex ml-6 items-center space-x-4">
          <Link href="/categories" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Categories
          </Link>
          <Link href="/collections" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Collections
          </Link>
          <Link href="/popular" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Popular
          </Link>
          <Link href="/info/about" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>

      {/* 모바일 네비게이션 */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 shadow-inner border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-3">
            {/* 모바일 검색 */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search illustrations..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-base touch-manipulation bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 p-1 touch-manipulation"
                >
                  🔍
                </button>
              </div>
            </form>
            <Link 
              href="/categories" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors font-medium touch-manipulation"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/collections" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors font-medium touch-manipulation"
              onClick={() => setMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              href="/popular" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors font-medium touch-manipulation"
              onClick={() => setMenuOpen(false)}
            >
              Popular
            </Link>
            <Link 
              href="/info/about" 
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors font-medium touch-manipulation"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            
            {/* 모바일 테마 토글 */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
