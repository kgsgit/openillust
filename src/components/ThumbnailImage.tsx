// src/components/ThumbnailImage.tsx
'use client';

import { FC, useState, useRef, useEffect } from 'react';

interface ThumbnailImageProps {
  /** 이미지 URL */
  src: string;
  /** alt 텍스트 */
  alt?: string;
}

// CDN 캐싱 URL 변환 함수
function toCdnUrl(raw: string) {
  const m = raw.match(/public\/illustrations\/images\/(.+)$/);
  return m ? `/cdn/illustrations/images/${m[1]}` : raw;
}

const ThumbnailImage: FC<ThumbnailImageProps> = ({
  src,
  alt = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' } // Load images 100px before they're visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cdnUrl = toCdnUrl(src);

  return (
    <div
      ref={imgRef}
      className="relative w-full overflow-hidden"
      style={{ paddingTop: '100%' }}  // 컨테이너를 정사각형으로 고정
    >
      {!isInView ? (
        // Placeholder while not in view
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      ) : (
        <>
          {!isLoaded && (
            // Loading placeholder
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <img
            src={cdnUrl}
            alt={alt}
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full object-contain object-center transition-opacity duration-300"
            style={{ opacity: isLoaded ? 1 : 0 }}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
      <div
        className="absolute inset-0"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default ThumbnailImage;
