// 파일 경로: src/components/IllustrationCard.tsx

'use client';
import { useRouter } from 'next/navigation';

interface IllustrationCardProps {
  id: number;
  title: string;
  imageUrl: string;
}

export default function IllustrationCard({ id, title, imageUrl }: IllustrationCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/illustration/${id}?id=${id}`)}
      style={{
        cursor: 'pointer',
        border: '1px solid #eee',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* 고정 높이 컨테이너: 작으면 가운데, 크면 축소/확대 */}
      <div
        style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ padding: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </h2>
      </div>
    </div>
  );
}
