import type { Metadata } from 'next';
import Link from 'next/link';
import { TrustPageLayout } from '@/components/compliance/TrustPageLayout';

export const metadata: Metadata = {
  title: 'Affiliate disclosure | Ember',
  description: 'How Ember may earn commission from retailer links, and why editorial choices stay independent.',
};

export default function AffiliateDisclosurePage() {
  return (
    <TrustPageLayout
      title="Affiliate disclosure"
      intro="Plain English for UK parents. Ember is a content-led discovery platform. Some retailer links may earn us a commission. That never changes our stage-fit or safety rules."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Commission on retailer links</h2>
        <p className="text-[#66717D]">
          When Ember links you to a retailer, we may earn a commission if you buy something. This is at no
          extra cost to you. Prices and checkout are always on the retailer&apos;s site.
        </p>
        <p className="text-[#66717D]">
          We are building affiliate partnerships over time. Not every link is an affiliate link today. Where
          a link is commercial, we aim to label it clearly on the page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Editorial independence</h2>
        <p className="text-[#66717D]">
          Commission does not decide which developmental focuses we show, which ideas we surface, or whether an
          item is suitable new-only or pre-loved. Stage relevance, parent usefulness, and safety come first.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Your data</h2>
        <p className="text-[#66717D]">
          Ember does not sell your personal data. Affiliate networks receive only what is needed to attribute
          a qualifying purchase, under their own policies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Questions</h2>
        <p className="text-[#66717D]">
          Read{' '}
          <Link href="/how-ember-makes-money" className="text-[#FF5C34] underline">
            how Ember makes money
          </Link>{' '}
          or{' '}
          <Link href="/how-we-choose" className="text-[#FF5C34] underline">
            how we choose
          </Link>
          . For product questions, visit{' '}
          <a href="https://www.emberplay.app" className="text-[#FF5C34] underline">
            emberplay.app
          </a>
          .
        </p>
      </section>
    </TrustPageLayout>
  );
}
