import Link from "next/link";
import Header from "../../components/Header";

export default function Success() {
  return (
    <main className="min-h-screen p-6">
      <Header />
      <section className="max-w-xl mx-auto text-center space-y-6 mt-12">
        <h2 className="text-2xl font-semibold">You're on the list! 🎉</h2>
        <p className="text-lg">Thanks for joining Ember. We’ll be in touch soon.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="rounded-md border px-4 py-2">Home</Link>
          <Link href="/play" className="rounded-md border px-4 py-2">Explore play ideas</Link>
        </div>
      </section>
    </main>
  );
}
