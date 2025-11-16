import { Content } from "@builder.io/sdk-react-nextjs";
import { getBuilderPage, BUILDER_API_KEY } from "@/lib/builder";

export const revalidate = 60;

type Props = { params: { path?: string[] } };

function Fallback() {
  return (
    <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
      <div className="h-6 w-48 mb-3 bg-[var(--color-border)] rounded" />
      <div className="h-4 w-80 mb-2 bg-[var(--color-border)] rounded" />
      <div className="h-4 w-64 bg-[var(--color-border)] rounded" />
    </div>
  );
}

export default async function CMSPage({ params }: Props) {
  const urlPath = "/" + (params.path?.join("/") ?? "");
  const content = await getBuilderPage(urlPath);
  if (!content) return <Fallback />;
  return (
    <Content
      model="page"
      apiKey={BUILDER_API_KEY}
      content={content}
    />
  );
}
