import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search = await props.searchParams;

  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        qs.append(key, v);
      }
    } else if (typeof value === "string") {
      qs.append(key, value);
    }
  }

  const queryString = qs.toString();
  const dest = `/cms/${slug}${queryString ? `?${queryString}` : ""}`;

  redirect(dest);
}
