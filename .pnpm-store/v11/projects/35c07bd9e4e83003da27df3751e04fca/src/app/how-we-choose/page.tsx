import type { Metadata } from 'next';
import Link from 'next/link';
import { TrustPageLayout } from '@/components/compliance/TrustPageLayout';
import { HOW_WE_CHOOSE_BODY, HOW_WE_CHOOSE_TITLE } from '@/components/discover/HowWeChooseSheet';

export const metadata: Metadata = {
  title: 'How we choose | Ember',
  description: 'How Ember selects stage-fit ideas and product examples for UK parents.',
};

export default function HowWeChoosePage() {
  return (
    <TrustPageLayout
      title={HOW_WE_CHOOSE_TITLE}
      intro="Our methodology is practical and parent-first. Commercial commission does not determine inclusion."
    >
      <p className="text-[#66717D] whitespace-pre-line">{HOW_WE_CHOOSE_BODY}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">What we weigh</h2>
        <ul className="list-disc pl-5 space-y-2 text-[#66717D]">
          <li>
            <strong className="text-[#253044]">Age and stage relevance</strong> — ideas tied to what children
            are often practising now.
          </li>
          <li>
            <strong className="text-[#253044]">Parent usefulness</strong> — clear labels, UK availability where
            we can show it, and honest &quot;why this&quot; reasoning.
          </li>
          <li>
            <strong className="text-[#253044]">Safety and suitability</strong> — including new-only or
            pre-loved guidance where our rules apply. See{' '}
            <Link href="/safety-rules" className="text-[#FF5C34] underline">
              safety rules
            </Link>
            .
          </li>
          <li>
            <strong className="text-[#253044]">Retailer clarity</strong> — outbound links labelled; affiliate
            links disclosed.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Commercial independence</h2>
        <p className="text-[#66717D]">
          Affiliate commission does not decide which focuses, categories, or examples appear. If we cannot
          verify a product properly, it does not make the cut.
        </p>
      </section>

      <p className="text-[#66717D]">
        Try Discover:{' '}
        <Link href="/discover/26" className="text-[#FF5C34] underline">
          browse for 26 months
        </Link>
        .
      </p>
    </TrustPageLayout>
  );
}
