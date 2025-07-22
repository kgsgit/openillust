// src/app/info/contact/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Contact | Openillust",
  description: "How to reach the Openillust team.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 lg:px-8 py-16">
      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Contact
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Openillust is focused on providing stable access to curated illustrations.
          We generally do not engage in open communication or feedback collection.
        </p>
        <Image
          src="/about/4.svg"
          alt="Paper plane doodle"
          width={200}
          height={200}
          className="mx-auto mt-4"
        />
      </section>

      {/* EMAIL INFO */}
      <section className="prose prose-gray lg:prose-lg mx-auto text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Email</h2>
        <p>
          For essential inquiries only, contact us at: <br />
          <a href="mailto:openillust@gmail.com" className="font-medium">
            openillust@gmail.com
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please note that responses may be delayed, and we may not reply to all messages.
        </p>
      </section>
    </main>
  );
}
