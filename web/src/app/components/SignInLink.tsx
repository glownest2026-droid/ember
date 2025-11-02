import Link from 'next/link';

export default function SignInLink({ className = '' }) {
  return (
    <Link href="/signin" className={`btn btn-primary ${className}`}>
      Sign in
    </Link>
  );
}
