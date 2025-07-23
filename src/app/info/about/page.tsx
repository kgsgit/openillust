import Image from "next/image";

export const metadata = {
  title: "About | Openillust",
  description: "What Openillust is, how it works, and how to use it.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 lg:px-8 py-16 space-y-10">
      {/* HERO */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Openillust is quiet by design.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          No logins. No clutter. Just illustrations—ready when you are.
        </p>
        <Image
          src="/about/1.svg"
          alt="Team celebrating"
          width={500}
          height={400}
          priority
          className="mx-auto mt-12"
        />
      </section>

      {/* WHAT IS OPENILLUST */}
      <section className="bg-gray-50 rounded-xl px-6 py-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">What is Openillust?</h2>
        <p className="mb-4">
          Openillust is a free illustration curation platform designed for simplicity and usefulness.
          Rather than overwhelming you with options, we focus on clarity—delivering visuals that serve
          a purpose, with consistency and care.
        </p>
        <p>
          Each image is generated internally, reviewed by hand, and grouped into collections for visual consistency.
          You’ll find cohesive styles across themes, built to fit slides, apps, or social designs without extra editing.
        </p>
      </section>

      {/* DOWNLOAD LIMIT */}
      <section className="bg-gray-50 rounded-xl px-6 py-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Daily download limit</h2>
        <p className="mb-2">
          To keep the service fast and reliable for everyone, downloads are limited to
          <strong> 10 illustrations per day</strong>. No sign-up is required.
        </p>
        <p className="text-gray-600">
          This limit may be adjusted in the future as the service evolves.
        </p>
      </section>

      {/* HOW TO USE */}
      <section className="bg-gray-50 rounded-xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <Image
            src="/about/3.svg"
            alt="Parent strolling"
            width={200}
            height={200}
            className="w-44"
          />
          <h2 className="text-2xl font-semibold tracking-tight">How to use</h2>
        </div>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Browse</strong> — use tags, categories, or collections.
          </li>
          <li>
            <strong>Preview</strong> — click any thumbnail to view details.
          </li>
          <li>
            <strong>Download</strong> — choose SVG or PNG and edit freely.
          </li>
        </ol>
      </section>

      {/* LICENSE */}
      <section className="bg-gray-50 rounded-xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <Image
            src="/about/2.svg"
            alt="Designer at desk"
            width={200}
            height={200}
            className="w-44"
          />
          <h2 className="text-2xl font-semibold tracking-tight">License &amp; usage</h2>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>CC BY 4.0</strong> — personal and commercial use, remixing and modification allowed.
          </li>
          <li>
            Attribution is optional, but appreciated.
          </li>
          <li>
            Redistribution or resale of the raw files is not permitted.
          </li>
        </ul>
      </section>

      {/* CONTACT */}
      <section className="text-center space-y-4">
        <Image
          src="/about/5.svg"
          alt="Croissant "
          width={200}
          height={200}
          className="mx-auto"
        />
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
        <p>
          If you have a question that really can’t wait,  
          you can reach us at <br />
          <a href="mailto:openillust@gmail.com">openillust@gmail.com</a>.
        </p>
        <p className="text-sm text-gray-500">
          Please note that responses may take some time, and we may not reply to all messages.
        </p>
      </section>

      {/* SLOGAN */}
      <section className="pt-8 text-center">
        <p className="text-2xl font-semibold leading-snug text-gray-700 max-w-xl mx-auto">
          Take what you need and carry on—
          <br className="hidden sm:inline" />
          quiet tools make room for big ideas.
        </p>
      </section>
    </main>
  );
}
