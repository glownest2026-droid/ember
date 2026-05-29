import type { Metadata } from 'next';
import Link from 'next/link';
import { TrustPageLayout } from '@/components/compliance/TrustPageLayout';

export const metadata: Metadata = {
  title: 'How Ember makes money | Ember',
  description: 'Ember’s commercial model: free discovery, optional Plus, affiliate links, and no sale of personal data.',
};

export default function HowEmberMakesMoneyPage() {
  return (
    <TrustPageLayout
      title="How Ember makes money"
      intro="We want you to understand how Ember stays free to browse and how commercial relationships work."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Free stage-aware discovery</h2>
        <p className="text-[#66717D]">
          Discover helps you see what children often practise at each stage, pick a developmental focus, and
          browse ideas and product examples. Core browsing is free.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Affiliate commission</h2>
        <p className="text-[#66717D]">
          Some outbound retailer links may earn Ember a commission at no extra cost to you. We are applying to
          affiliate programmes and will label commercial links where relevant. Commission never overrides our
          stage-fit or safety rules. See our{' '}
          <Link href="/affiliate-disclosure" className="text-[#FF5C34] underline">
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Ember Plus (optional)</h2>
        <p className="text-[#66717D]">
          Ember Plus is an optional subscription for parents who want more buying guidance over time. Details
          and pricing are on our{' '}
          <Link href="/pricing" className="text-[#FF5C34] underline">
            pricing page
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Marketplace (where available)</h2>
        <p className="text-[#66717D]">
          Ember may offer parent-to-parent listings in some areas. Any future marketplace fees would be
          explained clearly before you pay. We do not invent fees in advance of a live product.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">What we do not do</h2>
        <ul className="list-disc pl-5 space-y-2 text-[#66717D]">
          <li>We do not sell your personal data.</li>
          <li>We do not run cashback, voucher scraping, or incentivised click schemes.</li>
          <li>Commercial relationships do not decide safety or stage fit.</li>
        </ul>
      </section>
    </TrustPageLayout>
  );
}
