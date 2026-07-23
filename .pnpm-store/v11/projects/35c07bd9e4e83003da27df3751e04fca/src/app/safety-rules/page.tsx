import type { Metadata } from 'next';
import Link from 'next/link';
import { TrustPageLayout } from '@/components/compliance/TrustPageLayout';

export const metadata: Metadata = {
  title: 'Safety rules | Ember',
  description: 'High-level safety guidance for new-only items, pre-loved suitability, and parent responsibility.',
};

export default function SafetyRulesPage() {
  return (
    <TrustPageLayout
      title="Safety rules"
      intro="This is practical guidance for parents, not medical or legal advice. Always follow manufacturer instructions and current UK safety advice."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Safety comes before shopping</h2>
        <p className="text-[#66717D]">
          Ember surfaces stage-fit ideas and product examples to help you decide. Nothing here replaces your
          judgment, official recalls, or professional advice when you need it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">New-only and restricted categories</h2>
        <p className="text-[#66717D]">
          Some categories are better bought new only, such as items where hygiene, wear, or safety standards
          matter most. Ember may treat certain product types as new-only in guidance. When in doubt, choose
          new from a trusted retailer.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Pre-loved suitability</h2>
        <p className="text-[#66717D]">
          Pre-loved can be fine for many play items when you check condition, age suitability, provenance, and
          any recall or safety notices. Suitability depends on category, how it was stored, missing parts, and
          your child&apos;s stage. We compare new and pre-loved options where it helps, but you make the final
          call.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">What to check every time</h2>
        <ul className="list-disc pl-5 space-y-2 text-[#66717D]">
          <li>Manufacturer age guidance and assembly instructions.</li>
          <li>Loose parts, batteries, magnets, cords, and stability.</li>
          <li>Signs of damage, mould, or missing safety fittings on second-hand items.</li>
          <li>Current UK product safety and recall information from official sources.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#253044]">Marketplace listings</h2>
        <p className="text-[#66717D]">
          If you use Ember&apos;s parent-to-parent marketplace, meet safely, inspect items in person when you
          can, and follow our in-product safety tips. Ember does not verify every private listing.
        </p>
      </section>

      <p className="text-[#66717D]">
        Read{' '}
        <Link href="/how-we-choose" className="text-[#FF5C34] underline">
          how we choose
        </Link>{' '}
        or explore{' '}
        <Link href="/discover/26?wrapper=little-hands&show=1" className="text-[#FF5C34] underline">
          Discover examples
        </Link>
        .
      </p>
    </TrustPageLayout>
  );
}
