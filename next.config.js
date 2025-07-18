/** @type {import('next').NextConfig} */
const nextConfig = {
  // (기존 설정이 있다면 이 안에 함께 놓으세요)
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
