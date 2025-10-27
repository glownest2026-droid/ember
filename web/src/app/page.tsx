export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold">Ember</h1>
        <p className="text-lg">Simple, trusted guidance from bump to big steps.</p>
        <a href="/play" className="inline-block rounded-xl border px-4 py-2">
          Explore play ideas
        </a>
      </div>
    </main>
  );
}
