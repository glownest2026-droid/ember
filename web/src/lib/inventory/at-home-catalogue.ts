import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type AtHomeCatalogueType = {
  slug: string;
  label: string;
  subtitle: string | null;
};

export type AtHomeCatalogueFamily = {
  slug: string;
  label: string;
  hint: string | null;
  types: AtHomeCatalogueType[];
};

export type AtHomeCatalogue = {
  families: AtHomeCatalogueFamily[];
  typeBySlug: Map<string, AtHomeCatalogueType & { family_slug: string | null; id: string }>;
};

export async function loadAtHomeCatalogue(
  supabase: SupabaseClient
): Promise<AtHomeCatalogue> {
  const [{ data: families }, { data: types }] = await Promise.all([
    supabase
      .from("item_type_families")
      .select("slug, label, hint")
      .eq("is_active", true)
      .order("label"),
    supabase
      .from("product_types")
      .select("id, slug, label, subtitle, family_slug")
      .eq("is_active", true)
      .order("label"),
  ]);

  const typesByFamily = new Map<string, AtHomeCatalogueType[]>();
  const typeBySlug = new Map<
    string,
    AtHomeCatalogueType & { family_slug: string | null; id: string }
  >();

  for (const row of types ?? []) {
    const entry = {
      id: row.id as string,
      slug: String(row.slug),
      label: String(row.label),
      subtitle: row.subtitle ? String(row.subtitle) : null,
      family_slug: row.family_slug ? String(row.family_slug) : null,
    };
    typeBySlug.set(entry.slug, entry);
    if (entry.family_slug) {
      const list = typesByFamily.get(entry.family_slug) ?? [];
      list.push({
        slug: entry.slug,
        label: entry.label,
        subtitle: entry.subtitle,
      });
      typesByFamily.set(entry.family_slug, list);
    }
  }

  const catalogueFamilies: AtHomeCatalogueFamily[] = (families ?? []).map((family) => ({
    slug: String(family.slug),
    label: String(family.label),
    hint: family.hint ? String(family.hint) : null,
    types: typesByFamily.get(String(family.slug)) ?? [],
  }));

  return {
    families: catalogueFamilies.filter((family) => family.types.length > 0),
    typeBySlug,
  };
}
