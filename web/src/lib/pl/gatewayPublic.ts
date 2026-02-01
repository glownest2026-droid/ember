import { createClient } from '../../utils/supabase/server';

function safeSupabaseErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'unknown error';
  const anyErr = err as any;
  if (typeof anyErr.message === 'string' && anyErr.message) return anyErr.message;
  if (typeof anyErr.code === 'string' && anyErr.code) return anyErr.code;
  return 'unknown error';
}

export type GatewayAgeBand = {
  id: string;
  label: string | null;
  min_months: number | null;
  max_months: number | null;
};

export type GatewayWrapper = {
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  age_band_id: string;
  rank: number;
};

export type GatewayWrapperDetail = {
  age_band_id: string;
  rank: number;
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  development_need_id: string;
  development_need_name: string;
  development_need_slug: string;
  plain_english_description: string | null;
  why_it_matters: string | null;
  stage_anchor_month: number | null;
  stage_phase: string | null;
  stage_reason: string | null;
};

export type GatewayCategoryType = {
  age_band_id: string;
  development_need_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  slug: string;
  label: string;
  name: string;
  description: string | null;
  image_url: string | null;
  safety_notes: string | null;
};

export type GatewayProduct = {
  age_band_id: string;
  category_type_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  canonical_url: string | null;
  amazon_uk_url: string | null;
  affiliate_url: string | null;
  affiliate_deeplink: string | null;
};

export type GatewayFetchResult<T> = { data: T; error: string | null };

/**
 * PR2 Public Contract:
 * Public /new read-path uses curated gateway public views ONLY.
 */
export async function getGatewayAgeBands(): Promise<GatewayFetchResult<GatewayAgeBand[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_gateway_age_bands_public')
    .select('id, label, min_months, max_months')
    .order('min_months', { ascending: true });

  if (error) return { data: [], error: safeSupabaseErrorMessage(error) };
  return { data: (data ?? []) as GatewayAgeBand[], error: null };
}

export async function getGatewayWrappers(ageBandId: string): Promise<GatewayFetchResult<GatewayWrapper[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_gateway_wrappers_public')
    .select('ux_wrapper_id, ux_label, ux_slug, ux_description, age_band_id, rank')
    .eq('age_band_id', ageBandId)
    .order('rank', { ascending: true });

  if (error) return { data: [], error: safeSupabaseErrorMessage(error) };
  return { data: (data ?? []) as GatewayWrapper[], error: null };
}

export async function getGatewayWrapperDetail(
  ageBandId: string,
  uxWrapperId: string
): Promise<GatewayFetchResult<GatewayWrapperDetail | null>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_gateway_wrapper_detail_public')
    .select('*')
    .eq('age_band_id', ageBandId)
    .eq('ux_wrapper_id', uxWrapperId)
    .limit(1)
    .maybeSingle();

  if (error) return { data: null, error: safeSupabaseErrorMessage(error) };
  return { data: (data ?? null) as GatewayWrapperDetail | null, error: null };
}

export async function getGatewayCategoryTypes(
  ageBandId: string,
  developmentNeedId: string
): Promise<GatewayFetchResult<GatewayCategoryType[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_gateway_category_types_public')
    .select('*')
    .eq('age_band_id', ageBandId)
    .eq('development_need_id', developmentNeedId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true });

  if (error) return { data: [], error: safeSupabaseErrorMessage(error) };
  return { data: (data ?? []) as GatewayCategoryType[], error: null };
}

export async function getGatewayProducts(
  ageBandId: string,
  categoryTypeIds: string[]
): Promise<GatewayFetchResult<GatewayProduct[]>> {
  if (categoryTypeIds.length === 0) return { data: [], error: null };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('v_gateway_products_public')
    .select('*')
    .eq('age_band_id', ageBandId)
    .in('category_type_id', categoryTypeIds)
    .order('rank', { ascending: true })
    .order('id', { ascending: true });

  if (error) return { data: [], error: safeSupabaseErrorMessage(error) };
  return { data: (data ?? []) as GatewayProduct[], error: null };
}

