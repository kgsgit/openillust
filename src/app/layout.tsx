// 파일 경로: src/app/layout.tsx
import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientOnly from '@/components/ClientOnly';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Images at Your Fingertips, Curated for Purpose.</title>
        <meta
          name="description"
          content="Openillust is not just a repository of images. We curate only the ones you can actually use, without unnecessary repetition. Each illustration is chosen and refined according to rigorous criteria. A quiet tool that won’t hinder your creativity. No complex requirements—just the images you need, ready to use."
        />
        <meta property="og:title" content="Images at Your Fingertips, Curated for Purpose." />
        <meta
          property="og:description"
          content="Openillust is not just a repository of images. We curate only the ones you can actually use, without unnecessary repetition. Each illustration is chosen and refined according to rigorous criteria. A quiet tool that won’t hinder your creativity. No complex requirements—just the images you need, ready to use."
        />
        <meta property="og:url" content="https://www.openillust.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.openillust.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.openillust.com" />

        {/* Google AdSense code snippet */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-2152944666199864"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <ClientOnly />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
