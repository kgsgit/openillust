/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async headers() {
    return [
      {
        source: '/cdn/illustrations/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
