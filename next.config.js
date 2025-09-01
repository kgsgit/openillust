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
};

module.exports = nextConfig;
