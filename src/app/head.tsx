// src/app/head.tsx
export default function Head() {
  return (
    <>
      {/* 필수 메타 */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* 기본 SEO 메타 - 새로운 카피 반영 */}
      <title>Download instantly, no signup required - OpenIllust</title>
      <meta
        name="description"
        content="10 free downloads daily, commercial use allowed. Quality illustrations ready for business use without signup hassles."
      />
      <link rel="canonical" href="https://www.openillust.com" />
      
      {/* Open Graph - 새로운 카피 반영 */}
      <meta property="og:title" content="Download instantly, no signup required - OpenIllust" />
      <meta
        property="og:description"
        content="10 free downloads daily, commercial use allowed. Use commercially without worry."
      />
      <meta property="og:url" content="https://www.openillust.com" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.openillust.com/og-image.png" />
      
      {/* Twitter Cards - 새로운 카피 반영 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Download instantly, no signup required - OpenIllust" />
      <meta
        name="twitter:description"
        content="10 free downloads daily, commercial use allowed. Use commercially without worry."
      />
      <meta name="twitter:image" content="https://www.openillust.com/og-image.png" />

      {/* Google AdSense */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2152944666199864"
        crossOrigin="anonymous"
      ></script>

      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-J0QHBDLF6F"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J0QHBDLF6F', { page_path: window.location.pathname });
          `,
        }}
      />

      {/* JSON-LD 구조화 데이터 - 새로운 카피 반영 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://www.openillust.com',
            name: 'OpenIllust',
            description:
              'Download instantly, no signup required. 10 free downloads daily, commercial use allowed. Quality illustrations for business use.',
            publisher: {
              '@type': 'Organization',
              name: 'OpenIllust',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.openillust.com/logo.png',
              },
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.openillust.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}