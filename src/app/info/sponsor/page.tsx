// src/app/info/sponsor/page.tsx
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Sponsor | Openillust",
  description: "Support Openillust and reach a creative audience.",
};

export default function SponsorPage() {
  return (
    <main className="prose prose-gray mx-auto w-full max-w-3xl px-6 lg:px-8 py-16">
      <h1>Sponsor&nbsp;Openillust</h1>

      <p>
        Openillust stays free and ad-light thanks to the generous support of our
        community and selected brand partners. If your product or service speaks
        to designers, developers, or educators, partnering with us is a natural
        fit.
      </p>

      {/* TIERS */}
      <h2>Sponsorship tiers</h2>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>What you get</th>
            <th>Monthly</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Supporter</strong></td>
            <td>Name listed on this page + linked logo</td>
            <td>$49</td>
          </tr>
          <tr>
            <td><strong>Featured</strong></td>
            <td>Supporter perks + sidebar banner on every page</td>
            <td>$199</td>
          </tr>
          <tr>
            <td><strong>Premium</strong></td>
            <td>
              Featured perks + branded collection (10 custom illustrations)
            </td>
            <td>$499</td>
          </tr>
        </tbody>
      </table>

      {/* HOW IT WORKS */}
      <h2>How it works</h2>
      <ol>
        <li>
          <strong>Say hello&nbsp;</strong>— email&nbsp;
          <a href="mailto:partner@openillust.com">partner@openillust.com</a>{" "}
          with a short intro to your brand.
        </li>
        <li>
          <strong>Pick a tier&nbsp;</strong>— we’ll confirm availability and send
          a Stripe invoice.
        </li>
        <li>
          <strong>Go live&nbsp;</strong>— your assets appear within 48&nbsp;hours
          of payment.
        </li>
      </ol>

      {/* BUY ME A COFFEE */}
      <h2>Just want to chip in?</h2>
      <p>
        Buy us a coffee and keep the servers humming — every little bit helps!
      </p>
      <p className="text-center">
        <Link
          href="https://www.buymeacoffee.com/yourusername"
          target="_blank"
          className="inline-block px-6 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 font-semibold"
        >
          ☕ Buy&nbsp;Me&nbsp;a&nbsp;Coffee
        </Link>
      </p>

      {/* AUDIENCE */}
      <h2>Our audience at a glance</h2>
      <ul>
        <li>120 K monthly visitors / 350 K page views</li>
        <li>Top regions: US 42 % · EU 23 % · KR 9 %</li>
        <li>Primary roles: designers (46 %), developers (32 %), teachers (12 %)</li>
      </ul>

      <Image
        src="/about/5.svg"
        alt="Handshake doodle"
        width={200}
        height={200}
        className="mx-auto mt-12"
      />

      <p className="text-center !mt-10">
        Let’s build something inspiring together.  
        <br />
        <a href="mailto:partner@openillust.com" className="underline">
          partner@openillust.com
        </a>
      </p>
    </main>
  );
}
