/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 시 관리자 페이지 제외
  async redirects() {
    return [
      {
        source: '/admin_qr/:path*',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '(.*Next.js.*)', // Next.js 빌드 봇 감지
          },
        ],
        destination: '/404',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // 클라이언트가 /cdn/illustrations/images/파일명 으로 요청하면
        source: '/cdn/illustrations/images/:path*',
        // 이 요청을 Supabase public bucket의 illustrations/images 폴더로 프록시
        destination:
          'https://jtdmtrdqhefekqgfxnpf.supabase.co/storage/v1/object/public/illustrations/images/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
