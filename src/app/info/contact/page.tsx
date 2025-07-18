// src/app/info/contact/page.tsx
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Contact | Openillust",
  description: "How to reach the Openillust team.",
};

export default function ContactPage() {
  return (
    <main className="prose prose-gray mx-auto w-full max-w-3xl px-6 lg:px-8 py-16">
      <h1>Get&nbsp;in&nbsp;touch</h1>

      <p>
        Whether you have a question, a collaboration idea, or just want to share
        feedback—drop us a line. We read every message.
      </p>

      {/* CONTACT INFO */}
      <h2>Direct e-mail</h2>
      <p>
        <a href="mailto:support@openillust.com" className="font-semibold">
          support@openillust.com
        </a>
        <br />
        Average response time: <strong>24&nbsp;hours</strong> (weekdays)
      </p>

      {/* SOCIAL */}
      <h2>Social media</h2>
      <ul>
        <li>
          Twitter / X:&nbsp;
          <Link
            href="https://twitter.com/openillust"
            target="_blank"
            className="underline"
          >
            @openillust
          </Link>
        </li>
        <li>
          Instagram:&nbsp;
          <Link
            href="https://instagram.com/openillust"
            target="_blank"
            className="underline"
          >
            @openillust
          </Link>
        </li>
      </ul>

      {/* PARTNERSHIP */}
      <h2>Partnerships &amp; sponsorship</h2>
      <p>
        Looking to feature your product or commission a custom illustration
        pack?&nbsp;
        <Link href="/info/sponsor" className="underline">
          Visit our sponsor page
        </Link>
        &nbsp;for details.
      </p>

      {/* LOCATION / MAP (optional) */}
      <h2>Where we’re based</h2>
      <p>
        Seoul, Republic&nbsp;of&nbsp;Korea&nbsp;— working remotely across
        multiple time zones.
      </p>

      <Image
        src="/about/4.svg"         /* reuse one of the SVGs, or add /contact/map.svg */
        alt="Paper plane doodle"
        width={200}
        height={200}
        className="mx-auto mt-10"
      />

      <p className="!mt-12 text-center">
        We’re always excited to hear how you use Openillust. Talk soon!
      </p>
    </main>
  );
}
