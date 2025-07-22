"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col gap-6 md:flex-row md:justify-between">
        {/* 링크 모음 */}
        <nav className="flex flex-wrap gap-4">
          <Link href="/info/about" className="hover:underline">
            About
          </Link>
          <Link href="/info/policy" className="hover:underline">
            Privacy&nbsp;Policy
          </Link>
          <Link href="/info/terms" className="hover:underline">
            Terms&nbsp;of&nbsp;Service
          </Link>
          <Link href="/info/contact" className="hover:underline">
            Contact
          </Link>
       
        </nav>

        {/* 저작권·고지 */}
        <div className="text-gray-500">
          © {new Date().getFullYear()} Openillust. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
