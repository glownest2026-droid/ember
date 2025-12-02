import { Suspense } from "react";
import {
  HeroBlock,
  ValuePropsBlock,
  StatsBarBlock,
} from "../blocks/BrandedBlocks";

function SampleBlocks() {
  return (
    <div className="space-y-8 py-8">
      <HeroBlock
        eyebrow="Ember preview"
        heading="Branded blocks wired"
        subheading="This diagnostic page exists to verify our block registration and styling."
        primaryLabel="Looks good"
        primaryHref="#"
        secondaryLabel="View in Builder"
        secondaryHref="#"
      />
      <ValuePropsBlock
        title="Why this matters"
        items={[
          { heading: "On-brand", body: "Pages stay visually coherent." },
          { heading: "Composable", body: "Founders can Lego-build pages." },
          { heading: "Safe", body: "No layout-breaking one-off components." },
        ]}
      />
      <StatsBarBlock
        items={[
          { label: "Blocks", value: "8" },
          { label: "Status", value: "Ready", helper: "for Builder" },
          { label: "Preview", value: "CMS/Diag" },
          { label: "Risk", value: "Low" },
        ]}
      />
    </div>
  );
}

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Suspense fallback={<p className="p-4 text-sm text-slate-500">Loading…</p>}>
        <SampleBlocks />
      </Suspense>
    </main>
  );
}
