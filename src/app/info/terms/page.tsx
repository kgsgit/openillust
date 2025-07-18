// src/app/info/terms/page.tsx
export const metadata = {
  title: "Terms of Service | Openillust",
  description: "The rules for using illustrations and this website.",
};

export default function TermsPage() {
  return (
    <main className="prose prose-gray mx-auto w-full max-w-4xl px-6 lg:px-8 py-16">
      <h1>Terms&nbsp;of&nbsp;Service</h1>

      <p>
        Welcome to Openillust. By accessing or downloading any illustration
        (“Content”) from this website, you agree to the following terms. If you
        do not accept them, please refrain from using the service.
      </p>

      <h2>1. License</h2>
      <p>
        All Content is released under <strong>Creative Commons&nbsp;BY&nbsp;4.0</strong>.
        You may copy, remix, transform, and build upon the material—even for commercial
        purposes—provided you give appropriate credit or a link to Openillust. Attribution
        is appreciated but <em>not</em> mandatory.
      </p>

      <h2>2. Prohibited uses</h2>
      <ul>
        <li>Re-selling or re-licensing the unmodified files on stock sites.</li>
        <li>Portraying the artwork as trademarked or exclusively yours.</li>
        <li>Using the site to distribute malware, spam, or illegal content.</li>
      </ul>

      <h2>3. Ownership</h2>
      <p>
        Openillust retains all intellectual-property rights not expressly
        granted in these terms. Logos and brand assets remain the property of
        their respective owners.
      </p>

      <h2>4. Disclaimer of warranties</h2>
      <p>
        The website and Content are provided “as is.” We give no guarantee that
        files will meet your requirements, be error-free, or always stay
        online. Use them at your own risk.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Openillust shall not be liable
        for any indirect or consequential damages arising from your use of the
        site or Content.
      </p>

      <h2>6. Service changes</h2>
      <p>
        We may update, suspend, or discontinue parts of the site at any
        time without notice. Updated terms will be posted here and take effect
        immediately.
      </p>

      <h2>7. Governing law</h2>
      <p>
        These terms are governed by the laws of the Republic of Korea. Any
        disputes shall be settled in the courts of Seoul.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions? Reach us at{" "}
        <a href="mailto:support@openillust.com">support@openillust.com</a>.
      </p>

      <p className="text-sm text-gray-500">Last updated: 09&nbsp;Jul&nbsp;2025</p>
    </main>
  );
}
