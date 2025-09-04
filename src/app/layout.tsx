import '@/styles/globals.css';
import '@/styles/modal.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsWrapper from '@/components/AnalyticsWrapper';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Download instantly, no signup required - OpenIllust',
  description: '10 free downloads daily, commercial use allowed. Quality illustrations ready for business use without signup hassles.',
  canonical: 'https://openillust.com/',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J0QHBDLF6F"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J0QHBDLF6F', {
                page_title: document.title,
                page_location: window.location.href
              });
            `,
          }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'OpenIllust',
              url: 'https://openillust.com',
              logo: 'https://openillust.com/logo.png',
              description: 'Free illustration downloads for commercial use. 10 daily downloads, no signup required.',
              sameAs: [
                'https://openillust.com'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                url: 'https://openillust.com/info/contact'
              }
            }),
          }}
        />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'OpenIllust',
              url: 'https://openillust.com',
              description: 'Download instantly, no signup required. 10 free downloads daily, commercial use allowed.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://openillust.com/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2152944666199864"
          crossOrigin="anonymous"
        />

        <AnalyticsWrapper />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

export const revalidate = 60;