// src/components/ThumbnailImage.tsx
'use client';

import { FC } from 'react';

interface ThumbnailImageProps {
  /** 이미지 URL */
  src: string;
  /** alt 텍스트 */
  alt?: string;
}

const ThumbnailImage: FC<ThumbnailImageProps> = ({
  src,
  alt = '',
}) => {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ paddingTop: '100%' }}  // 컨테이너를 정사각형으로 고정
    >
      <img
        src={src}
        alt={alt}
        className="absolute top-0 left-0 w-full h-full object-contain object-center"  // 전체 이미지 노출
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div
        className="absolute inset-0"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default ThumbnailImage;
