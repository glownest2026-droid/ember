'use client';
export default function SignOutPage() {
  async function doSignOut() {
    await fetch('/auth/signout', { method: 'POST' });
    window.location.href = '/';
  }
  return (
    <div style={{padding:16}}>
      <button onClick={doSignOut} className="px-3 py-2 rounded bg-black text-white">Sign out</button>
    </div>
  );
}
