// 파일 경로: src/components/IllustrationCard.tsx

'use client';
import { useRouter } from 'next/navigation';

interface IllustrationCardProps {
  id: number;
  title: string;
  imageUrl: string;
}

// CDN 캐싱 URL 변환 함수
function toCdnUrl(raw: string) {
  const m = raw.match(/public\/illustrations\/images\/(.+)$/);
  return m ? `/cdn/illustrations/images/${m[1]}` : raw;
}

export default function IllustrationCard({
  id,
  title,
  imageUrl,
}: IllustrationCardProps) {
  const router = useRouter();

  return (
    <div
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/illustration/${id}`)}
    >
      <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
        <img
          src={toCdnUrl(imageUrl)}
          alt={title}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            width: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ padding: '0.5rem' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
