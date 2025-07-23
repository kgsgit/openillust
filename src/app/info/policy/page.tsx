import Image from "next/image";

export const metadata = {
  title: "Privacy Policy | Openillust",
  description: "How Openillust handles user data and cookies.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 lg:px-8 py-16">
      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Openillust keeps data collection to the bare minimum. We don’t require sign-ups
          or store personal profiles. The few details we keep help us run the site smoothly.
        </p>
        <Image
          src="/about/7.svg"
          alt="ice cream"
          width={400}
          height={400}
          className="mx-auto mt-4"
        />
      </section>

      {/* POLICY CONTENT */}
      <section className="bg-gray-50 rounded-xl px-6 py-10 text-[17px] leading-relaxed space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">1. What we collect</h2>
          <ul className="space-y-3">
            <li>
              <strong>Server logs:</strong> IP address, browser type, timestamp, and visited pages.
              Stored temporarily for security and diagnostics.
            </li>
            <li>
              <strong>Download counts:</strong> Collected per artwork, never linked to individual identity.
            </li>
            <li>
              <strong>Cookies:</strong> Used for basic analytics and ad delivery. No tracking pixels or fingerprinting.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">2. How we use that data</h2>
          <ul className="space-y-3 list-disc list-inside">
            <li>To monitor site performance and prevent abuse</li>
            <li>To understand popular content and improve illustration planning</li>
            <li>To display minimal, contextual ads and keep the service free</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">3. Your choices</h2>
          <ul className="space-y-3">
            <li>You may block cookies in your browser—core features still work.</li>
            <li>
              You can request log deletion related to your IP by emailing us at{" "}
              <a href="mailto:openillust@gmail.com" className="underline">
                openillust@gmail.com
              </a>.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">4. Data security</h2>
          <p>
            All traffic is encrypted via HTTPS. Server logs and data are stored securely
            and only accessible to essential personnel.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">5. Policy updates</h2>
          <p>
            This policy may change as our service evolves. The “Last updated” date will reflect
            the latest revision.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: July 9, 2025
          </p>
        </div>
      </section>
    </main>
  );
}
