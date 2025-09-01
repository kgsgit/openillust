// 관리자 경로를 동적 렌더링으로 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function GET() {
  return new Response('Admin area', { status: 200 });
}