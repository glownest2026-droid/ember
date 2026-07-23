import Link from 'next/link';

const TRUST_LINKS = [
  { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
  { href: '/how-ember-makes-money', label: 'How Ember makes money' },
  { href: '/how-we-choose', label: 'How we choose' },
  { href: '/safety-rules', label: 'Safety rules' },
] as const;

export function PublicFooter() {
  return (
    <footer
      className="border-t border-[#E7E2DC] bg-[#FBFAF7] py-8 mt-auto"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 justify-center text-sm text-[#66717D]"
          aria-label="Legal and trust"
        >
          {TRUST_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#253044] underline-offset-2 hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/pricing" className="hover:text-[#253044] underline-offset-2 hover:underline">
            Pricing
          </Link>
          <Link href="/discover/26" className="hover:text-[#253044] underline-offset-2 hover:underline">
            Discover
          </Link>
        </nav>
        <p className="text-center text-xs text-[#66717D] mt-6">
          © {new Date().getFullYear()} Ember. UK parenting product discovery. We do not sell your personal data.
        </p>
      </div>
    </footer>
  );
}
