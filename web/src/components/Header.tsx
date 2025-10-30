"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-3xl mx-auto flex items-center justify-between py-2 px-4">
      <h1 className="text-2xl font-bold">
        <Link href="/">Ember</Link>
      </h1>
      <nav className="text-sm flex gap-4">
        <Link href="/" className="underline">Home</Link>
        <Link href="/play" className="underline">Play ideas</Link>
      </nav>
    </header>
  );
}
