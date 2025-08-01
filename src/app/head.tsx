// src/app/head.tsx
export default function Head() {
  return (
    <>
      {/* 필수 메타 */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* 기본 SEO 메타 */}
      <title>Images at Your Fingertips, Curated for Purpose.</title>
      <meta
        name="description"
        content="Openillust is not just a repository of images. We curate only the ones you can actually use, without unnecessary repetition. Each illustration is chosen and refined according to rigorous criteria."
      />
      <link rel="canonical" href="https://www.openillust.com" />
      <meta property="og:title" content="Images at Your Fingertips, Curated for Purpose." />
      <meta
        property="og:description"
        content="Openillust is not just a repository of images. We curate only the ones you can actually use…"
      />
      <meta property="og:url" content="https://www.openillust.com" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.openillust.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Images at Your Fingertips, Curated for Purpose." />
      <meta
        name="twitter:description"
        content="Openillust is not just a repository of images. We curate only the ones you can actually use…"
      />
      <meta name="twitter:image" content="https://www.openillust.com/og-image.png" />

      {/* Google AdSense */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-2152944666199864"
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

      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://www.openillust.com',
            name: 'Openillust',
            description:
              'Openillust is not just a repository of images. We curate only the ones you can actually use…',
            publisher: {
              '@type': 'Organization',
              name: 'Openillust',
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
