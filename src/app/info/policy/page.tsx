// src/app/info/policy/page.tsx
export const metadata = {
  title: "Privacy Policy | Openillust",
  description: "How we collect and use data at Openillust.",
};

export default function PolicyPage() {
  return (
    <main className="prose prose-gray mx-auto w-full max-w-4xl px-6 lg:px-8 py-16">
      <h1>Privacy&nbsp;Policy</h1>

      <p>
        Openillust keeps data collection to the bare minimum. We do not require
        sign-ups or store personal profiles. The few details we keep help us run
        the site smoothly and improve the artwork you see.
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li>
          <strong>Server logs</strong> — IP address, browser type, time stamp,
          and the pages you visit. Kept for 30 days for security and analytics.
        </li>
        <li>
          <strong>Download counts</strong> — summed per artwork, never tied to
          a personal identity.
        </li>
        <li>
          <strong>Cookies</strong> — small files set by Google&nbsp;AdSense and
          basic analytics; no tracking pixels or fingerprinting scripts.
        </li>
      </ul>

      <h2>2. How we use that data</h2>
      <ul>
        <li>To protect the site from abuse and diagnose errors.</li>
        <li>To surface popular illustrations and plan new collections.</li>
        <li>
          To display contextual ads via Google&nbsp;AdSense and keep the service
          free.
        </li>
      </ul>

      <h2>3. Third-party services</h2>
      <p>
        We rely on:
        <br />
        • <strong>Supabase</strong> for database &amp; storage<br />
        • <strong>Google&nbsp;AdSense</strong> for ads<br />
        • <strong>Vercel&nbsp;Analytics</strong> for anonymous traffic stats
      </p>

      <h2>4. Your choices</h2>
      <ul>
        <li>You can block cookies in your browser—core features still work.</li>
        <li>
          You may request log deletion tied to your IP via
          <a href="mailto:support@openillust.com">&nbsp;support@openillust.com</a>.
        </li>
      </ul>

      <h2>5. Data security</h2>
      <p>
        All traffic is served over HTTPS. Access to raw logs and databases is
        restricted to the core team and protected with two-factor
        authentication.
      </p>

      <h2>6. Policy updates</h2>
      <p>
        We revise this page when practices change. The “Last updated” date moves
        accordingly.
      </p>

      <p className="text-sm text-gray-500">Last updated: 09 Jul 2025</p>
    </main>
  );
}
