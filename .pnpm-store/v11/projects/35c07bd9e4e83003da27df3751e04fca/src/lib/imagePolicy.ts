export const ENABLE_AMAZON_IMAGES = false as const;

export type ImageSource =
  | 'amazon_paapi' | 'awin_feed' | 'cj_feed' | 'ebay_api'
  | 'brand_licensed' | 'own_photo' | 'stock_lifestyle' | 'none';

const HOSTS = {
  supabase_public: [/^https:\/\/.*supabase\.co\/storage\/v1\/object\/public\/product-images\//],
  ebay: [/^https:\/\/i\.ebayimg\.com\//],
  amazon: [/^https:\/\/m\.media-amazon\.com\//, /^https:\/\/images-na\.ssl-images-amazon\.com\//]
};

export function validateImage(
  source: ImageSource,
  url?: string,
  opts?: { affiliate_program?: 'ebay'|'awin'|'cj'|'amazon'|'skimlinks'|'sovrn'|'direct', proof?: string }
) {
  if (!url) return false;

  if (source === 'brand_licensed' || source === 'own_photo' || source === 'stock_lifestyle') {
    return HOSTS.supabase_public.some((re) => re.test(url));
  }

  if (source === 'ebay_api') {
    return HOSTS.ebay.some((re) => re.test(url));
  }

  if (source === 'awin_feed') {
    return url.startsWith('https://') && opts?.affiliate_program === 'awin' && !!opts?.proof;
  }

  if (source === 'cj_feed') {
    return url.startsWith('https://') && opts?.affiliate_program === 'cj' && !!opts?.proof;
  }

  if (source === 'amazon_paapi') {
    return ENABLE_AMAZON_IMAGES && HOSTS.amazon.some((re) => re.test(url));
  }

  return false; // 'none'
}
