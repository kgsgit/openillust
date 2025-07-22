// 경로: src/components/ThumbnailImage.tsx
'use client';

import { FC } from 'react';

interface ThumbnailImageProps {
  /** 이미지 URL */
  src: string;
  /** alt 텍스트 */
  alt?: string;
  /** padding-top 비율 (%). 기본 75% */
  ratio?: number;
}

const ThumbnailImage: FC<ThumbnailImageProps> = ({
  src,
  alt = '',
  ratio = 75,
}) => {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ paddingTop: `${ratio}%` }}
    >
      {/* 
         object-cover   : 비율 유지하며 컨테이너 가득 채우기
         object-top     : 위쪽을 기준점으로 잘라내기
      */}
      <img
        src={src}
        alt={alt}
        className="absolute top-0 left-0 w-full h-full object-cover object-top"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* 투명 레이어로 우클릭 완전 차단 */}
      <div
        className="absolute inset-0"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default ThumbnailImage;
