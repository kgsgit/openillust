// src/app/info/terms/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Terms of Service | Openillust",
  description: "Terms of using the Openillust illustration service.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 lg:px-8 py-16">
      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          By using Openillust, you agree to the terms outlined below. We aim to keep things simple and fair.
        </p>
        <Image
          src="/about/6.svg"
          alt="Terms"
          width={400}
          height={400}
          className="mx-auto mt-4"
        />
      </section>

      {/* TERMS CONTENT */}
      <section className="bg-gray-50 rounded-xl px-6 py-10 text-[17px] leading-relaxed space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">1. Service Overview</h2>
          <p>
            Openillust offers free curated illustrations for personal and commercial use. No sign-up is required,
            and content is delivered as-is.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">2. Acceptable Use</h2>
          <p>
            You may download and use illustrations in websites, apps, slides, educational materials, and
            similar contexts. Redistribution or resale of the illustrations themselves is not permitted.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">3. Prohibited Activities</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Repackaging or selling illustrations as-is</li>
            <li>Using content for deceptive, hateful, or unlawful purposes</li>
            <li>Scraping or bulk downloading without permission</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">4. Limitation of Liability</h2>
          <p>
            Openillust is provided without warranties. We are not liable for any damages arising from the use
            of the site or its content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">5. Copyright & Ownership</h2>
          <p>
            All illustrations are original works created by our team. You may use them freely within the permitted
            scope, but the copyright remains with Openillust.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">6. Changes to Terms</h2>
          <p>
            We may update these terms to reflect changes in service. The “Last updated” date will show the
            most recent revision.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: July 9, 2025</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
          <p>
            Questions or concerns? Email us at{" "}
            <a href="mailto:openillust@gmail.com" className="underline">
              support@openillust.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
