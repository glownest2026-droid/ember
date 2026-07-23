"use client";

import { Content, type BuilderContent } from "@builder.io/sdk-react";
import { brandedBlocks } from "./blocks/brandedComponents";

type Props = {
  apiKey: string;
  content: BuilderContent | null;
  urlPath: string;
  builderError: string | null;
};

export function BuilderPageClient({
  apiKey,
  content,
  urlPath,
  builderError,
}: Props) {
  if (!apiKey) {
    return (
      <div style={{ opacity: 0.9, marginTop: 12, color: "#b91c1c" }}>
        Missing NEXT_PUBLIC_BUILDER_API_KEY in this environment. Set it in Vercel
        (Project → Settings → Environment Variables) and redeploy.
      </div>
    );
  }

  return (
    <>
      <Content
        model="page"
        apiKey={apiKey}
        content={content || undefined}
        customComponents={brandedBlocks}
      />
      {builderError && (
        <div style={{ opacity: 0.9, marginTop: 12, color: "#b91c1c" }}>
          Builder error: {builderError}
        </div>
      )}
      {!builderError && !content && (
        <div style={{ opacity: 0.7, marginTop: 12 }}>
          No Builder entry found for urlPath={urlPath}
        </div>
      )}
    </>
  );
}
