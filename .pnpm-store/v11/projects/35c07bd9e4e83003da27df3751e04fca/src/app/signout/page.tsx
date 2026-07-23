'use client';
export default function SignOutPage() {
  async function doSignOut() {
    await fetch('/auth/signout', { method: 'POST' });
    window.location.href = '/';
  }
  return (
    <div className="container-wrap min-h-screen py-8">
      <h1 className="text-2xl font-semibold mb-4">Sign out</h1>
      <p className="text-sm text-[var(--ember-text-low)] mb-6">Ready to sign out of Ember?</p>
      <button
        type="button"
        onClick={doSignOut}
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-[var(--ember-accent-base)] hover:bg-[var(--ember-accent-hover)] transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
