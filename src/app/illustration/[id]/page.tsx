// 파일 경로: src/app/illustration/[id]/page.tsx

// 2) ISR: 60초마다 페이지를 재생성
export const revalidate = 60;
// 강제 서버 렌더링 (클라이언트 의존성 없이 항상 서버에서 처리)
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import IllustrationClient from '@/components/IllustrationClient';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

interface IllustrationData {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  tags?: string[] | null;
  collection_id?: number | null;
}
interface Tag { id: number; name: string; }
interface RelatedImage { id: number; image_url: string; }
// PageProps: params 자체를 Promise<{ id: string }>로 받습니다.
interface PageProps {
  params: Promise<{ id: string }>;
}

// 1) Metadata 생성: params는 Promise 이므로 반드시 await
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;  // ← 여기에서 await! :contentReference[oaicite:0]{index=0}
  const illustrationId = Number(id);

  const { data: ill, error } = await supabaseAdmin
    .from('illustrations')
    .select('title, description, image_url')
    .eq('id', illustrationId)
    .single();

  if (error || !ill) {
    return { title: 'Illustration not found' };
  }

  const ogImage = ill.image_url.replace(
    /public\/illustrations\/images\/(.+)$/,
    '/cdn/illustrations/images/$1'
  );

  return {
    title: ill.title,
    description: ill.description ?? undefined,
    openGraph: {
      title: ill.title,
      description: ill.description ?? undefined,
      images: [ogImage],
      url: `https://AboutMyHouse.kr/illustration/${illustrationId}`,
    },
    twitter: { card: 'summary_large_image' },
  };
}

// 3) 페이지 컴포넌트: 역시 await
export default async function IllustrationPage({ params }: PageProps) {
  const { id } = await params;  // ← 여기서도 await!
  const illustrationId = Number(id);

  // 기본 일러스트 데이터 로드
  const { data: illustration, error: illError } = (await supabaseAdmin
    .from('illustrations')
    .select('id, title, description, image_url, tags, collection_id')
    .eq('id', illustrationId)
    .single()) as { data: IllustrationData | null; error: any };

  if (illError || !illustration) {
    return <div className="p-8 text-center">Illustration not found.</div>;
  }

  // 태그 로드
  let tagObjs: Tag[] = [];
  if (illustration.tags?.length) {
    const { data: tagsData } = (await supabaseAdmin
      .from('tags')
      .select('id, name')
      .in('name', illustration.tags)) as { data: Tag[] | null };
    tagObjs = tagsData || [];
  }

  // 관련 이미지 로드
  let related: RelatedImage[] = [];
  if (illustration.collection_id) {
    const { data: relData } = (await supabaseAdmin
      .from('illustrations')
      .select('id, image_url')
      .eq('collection_id', illustration.collection_id)
      .neq('id', illustrationId)
      .eq('visible', true)
      .order('created_at', { ascending: false })
      .limit(10)) as { data: RelatedImage[] | null };
    related = relData || [];
  }

  return (
    <main className="container mx-auto max-w-screen-lg px-4 py-8">
      <IllustrationClient
        data={illustration}
        tags={tagObjs}
        related={related}
      />
    </main>
  );
}
