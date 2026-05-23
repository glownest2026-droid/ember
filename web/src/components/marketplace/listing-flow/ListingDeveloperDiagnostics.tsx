"use client";

type Props = {
  draftId: string | null;
  imageStoragePath: string | null;
};

export function ListingDeveloperDiagnostics({ draftId, imageStoragePath }: Props) {
  return (
    <details className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] p-3 text-xs text-[#5C646D]">
      <summary className="cursor-pointer font-medium text-[#1A1E23]">Developer diagnostics</summary>
      <div className="mt-2 space-y-1 break-all">
        <p>
          Draft ID: <span className="font-mono">{draftId ?? "none"}</span>
        </p>
        <p>
          Image path: <span className="font-mono">{imageStoragePath ?? "none"}</span>
        </p>
      </div>
    </details>
  );
}
