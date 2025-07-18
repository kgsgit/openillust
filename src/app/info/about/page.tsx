// src/app/info/about/page.tsx
import Image from "next/image";

export const metadata = {
  title: "About | Openillust",
  description: "Learn what drives Openillust and how to use it.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 lg:px-8 py-16">
      {/* HERO ●────────────────────────── */}
      <section className="text-center space-y-4 mb-20">
        <h1 className="text-4xl font-extrabold tracking-tight">
          The image you need,<br className="hidden md:block" /> exactly when you
          need it.
        </h1>
        <p className="text-lg text-gray-600">
          Discover visuals that spark fresh ideas without slowing you down. One
          click, zero fuss—curated illustrations that slip effortlessly into any
          project.
        </p>
        <Image
          src="/about/1.svg"
          alt="Team celebrating"
          width={320}
          height={320}
          priority
          className="mx-auto mt-8"
        />
      </section>

      {/* EXPERIENCES ●──────────────────── */}
      <section className="prose prose-gray lg:prose-lg mx-auto mb-20">
        <h2>Three things you’ll feel here</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="m-0">Concept&nbsp;Select</h3>
            <p>
              Cohesive series from each artist—pick a collection and your style
              is set.
            </p>
          </article>
          <article className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="m-0">Style&nbsp;Spectrum</h3>
            <p>
              From pen drawings to flat vectors and minimal graphics—use what
              fits, keep the overall harmony.
            </p>
          </article>
          <article className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="m-0">Safety&nbsp;&amp;&nbsp;Trust</h3>
            <p>
              Google-vetted, ad-light, HTTPS everywhere. Download with peace of
              mind.
            </p>
          </article>
        </div>
      </section>

      {/* WHY ●──────────────────────────── */}
      <section className="prose prose-gray lg:prose-lg mx-auto mb-20">
        <h2>Why Openillust?</h2>
        <Image
          src="/about/2.svg"
          alt="Designer at desk"
          width={260}
          height={260}
          className="float-right ml-6 mb-4 w-52"
        />
        <h3>Concept Select</h3>
        <p>
          Browse series crafted by the same hand. Whether you’re building slides
          or an app UI, keep that &ldquo;different yet consistent&rdquo; vibe
          with zero extra effort.
        </p>

        <h3>Style Spectrum</h3>
        <p>
          Need a crisp outline? A playful flat scene? A minimal icon? Grab the
          tone you want—our visual grid stays balanced either way.
        </p>

        <h3>Safety &amp; Trust</h3>
        <p>
          Every asset clears an internal cleanliness check before going live.
          HTTPS keeps transfers secure, and we keep ads sparse and unobtrusive.
        </p>
      </section>

      {/* HOW TO USE ●───────────────────── */}
      <section className="prose prose-gray lg:prose-lg mx-auto mb-20">
        <Image
          src="/about/3.svg"
          alt="Parent strolling"
          width={260}
          height={260}
          className="float-left mr-6 mb-4 w-52"
        />
        <h2>How to use it in three beats</h2>
        <ol>
          <li>
            <strong>Search &amp; explore</strong> — tags, categories,
            collections.
          </li>
          <li>
            <strong>Preview</strong> — tap once for a closer look and specs.
          </li>
          <li>
            <strong>Instant download</strong> — snag SVG or PNG, edit freely.
          </li>
        </ol>
      </section>

      {/* LICENSE ●──────────────────────── */}
      <section className="prose prose-gray lg:prose-lg mx-auto mb-20">
        <h2>License &amp; usage</h2>
        <ul>
          <li>
            <strong>CC BY 4.0</strong> — commercial, personal, remix welcomed.
          </li>
          <li>No mandatory credit, though a shout-out is always nice.</li>
          <li>Reselling the raw files themselves is off-limits.</li>
        </ul>
       
      </section>

      {/* CONTACT ●──────────────────────── */}
      <section className="prose prose-gray lg:prose-lg mx-auto text-center">
        <Image
          src="/about/5.svg"
          alt="Croissant doodle"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h2>Contact us</h2>
        <p>
          <strong>Email</strong> :{" "}
          <a href="mailto:support@openillust.com">support@openillust.com</a>
          <br />
          <strong>Partner with us</strong> : <a href="/info/sponsor">Sponsor&nbsp;page</a>
          <br />
          <strong>Spot an issue?</strong> Use the “Report” link under any image
          or drop us a line.
        </p>
        <p className="!mt-10">
          Grab what you need and sprint to your next idea—we’ll be cheering
          quietly in the background.
        </p>
      </section>
    </main>
  );
}
