import Link from 'next/link';
import { validateImage } from '../../../../../lib/imagePolicy';

type Product = {
  id: string;
  name: string;
  rating: number | null;
  age_band: string;
  why_it_matters?: string | null;
  image_url?: string | null;
  image_source?: string;
  affiliate_program?: string;
  proof_of_rights_url?: string | null;
  deep_link_url?: string | null;
  affiliate_url?: string | null;
  affiliate_deeplink?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  // Determine outbound URL with precedence: deep_link_url > affiliate_url > affiliate_deeplink
  const outboundUrl = product.deep_link_url || product.affiliate_url || product.affiliate_deeplink || null;

  // Validate image
  const imageOk = validateImage(
    (product.image_source as any) || 'none',
    product.image_url || undefined,
    {
      affiliate_program: product.affiliate_program as any,
      proof: product.proof_of_rights_url || undefined,
    }
  );
  const imageSrc = imageOk && product.image_url ? product.image_url : null;

  return (
    <div className="rounded-2xl shadow p-4 border">
      {imageSrc && (
        <div className="w-full aspect-square overflow-hidden rounded bg-gray-100 mb-3">
          <img 
            src={imageSrc} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            loading="lazy" 
          />
        </div>
      )}
      <h3 className="font-semibold">{product.name}</h3>
      {product.rating != null && (
        <p className="text-sm opacity-80 mt-1">⭐ {product.rating.toFixed(1)} · {product.age_band}</p>
      )}
      {product.why_it_matters && (
        <p className="mt-2 text-sm text-gray-600">{product.why_it_matters}</p>
      )}
      {outboundUrl ? (
        <Link
          href={outboundUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 inline-block px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800"
        >
          View product
        </Link>
      ) : (
        <button
          disabled
          className="mt-3 inline-block px-4 py-2 rounded bg-gray-300 text-gray-500 text-sm cursor-not-allowed"
        >
          View product
        </button>
      )}
    </div>
  );
}


