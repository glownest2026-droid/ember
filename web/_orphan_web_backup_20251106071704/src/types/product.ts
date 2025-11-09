import type { ImageSource } from '@/lib/imagePolicy';

export interface Product {
  id?: string;
  name: string;
  rating: number;              // >= 4 enforced by DB trigger + client guard
  age_band: string;            // e.g. "12-18m"
  tags?: string[];             // ["fine-motor","music"]
  why_it_matters?: string;
  affiliate_program?: 'ebay'|'awin'|'cj'|'skimlinks'|'sovrn'|'amazon'|'direct';
  affiliate_deeplink?: string;
  image_source: ImageSource;
  image_url?: string;
  proof_of_rights_url?: string;
  can_cache?: boolean;
  refresh_rule?: string;
  last_refreshed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
