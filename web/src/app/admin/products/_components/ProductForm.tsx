'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { validateImage } from '../../../../lib/imagePolicy';
import type { Product } from '../../../../types/product';
import { createClient } from '../../../../utils/supabase/client';

const SOURCES = ['ebay_api','awin_feed','cj_feed','brand_licensed','own_photo','stock_lifestyle'] as const;
const UPLOAD_ONLY = new Set(['brand_licensed','own_photo','stock_lifestyle']);
const URL_ONLY = new Set(['ebay_api']); // extend later if you add more CDNs

export default function ProductForm({ initial }: { initial?: Partial<Product> }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string>(initial?.image_source ?? 'stock_lifestyle');

  const isUploadOnly = useMemo(() => UPLOAD_ONLY.has(imageSource as any), [imageSource]);
  const isUrlOnly = useMemo(() => URL_ONLY.has(imageSource as any), [imageSource]);

  async function onUploadToBucket(file: File) {
    const safeName = (file.name?.trim() || 'image.jpg').replace(/[^\w.\-]+/g,'_');
    const path = `manual/${Date.now()}-${safeName}`;
    const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: pub } = supabase.storage.from('product-images').getPublicUrl(data.path);
    return pub.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      const source = String(fd.get('image_source') || '');
      const fileEl = form.elements.namedItem('file') as HTMLInputElement | null;
      const file = fileEl?.files?.[0] || null;
      let image_url = String(fd.get('image_url') || '');

      if (UPLOAD_ONLY.has(source as any)) {
        if (!file) throw new Error('Please upload an image for this image source.');
        image_url = await onUploadToBucket(file);
      }
      if (URL_ONLY.has(source as any)) {
        if (!image_url) throw new Error('Please provide an image URL for this image source.');
        if (source === 'ebay_api' && !/^https:\/\/i\.ebayimg\.com\//i.test(image_url)) {
          throw new Error('For eBay source, the URL must start with https://i.ebayimg.com/');
        }
      }

      const p: any = {
        id: initial?.id,
        name: String(fd.get('name') || '').trim(),
        rating: Number(fd.get('rating')),
        age_band: String(fd.get('age_band') || '').trim(),
        tags: String(fd.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean),
        why_it_matters: String(fd.get('why_it_matters') || '') || null,
        affiliate_program: String(fd.get('affiliate_program') || '') || null,
        affiliate_deeplink: String(fd.get('affiliate_deeplink') || '') || null,
        image_source: source,
        image_url: image_url || null,
        proof_of_rights_url: String(fd.get('proof_of_rights_url') || '') || null,
      };

      if (!p.name) throw new Error('Name is required');
      if (!p.age_band) throw new Error('Age band is required');
      // Rating is optional, but if provided must be between 0 and 5
      if (p.rating !== undefined && p.rating !== null) {
        if (!Number.isFinite(p.rating)) throw new Error('Rating must be a number');
        if (p.rating < 0 || p.rating > 5) throw new Error('Rating must be between 0 and 5');
      }

      const ok = validateImage(p.image_source, p.image_url ?? undefined, {
        affiliate_program: p.affiliate_program ?? undefined,
        proof: p.proof_of_rights_url ?? undefined,
      });
      if (!ok && p.image_source !== 'stock_lifestyle') {
        throw new Error('Image not permitted for selected source. Use upload for own/brand/stock, or i.ebayimg.com for eBay.');
      }

      const { error } = await supabase.from('products').upsert(p, { onConflict: 'id' });
      if (error) throw error;

      router.push('/admin/products');
      router.refresh();
    } catch (e:any) {
      setError(e.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      {error && <div className="rounded bg-red-100 p-2 text-red-700">{error}</div>}

      <div><label className="block text-sm">Name</label>
        <input name="name" defaultValue={initial?.name} className="w-full border p-2 rounded" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm">Rating (optional, 0-5)</label>
          <input type="number" step="0.1" min="0" max="5" name="rating" defaultValue={initial?.rating ?? ''} className="w-full border p-2 rounded" />
        </div>
        <div><label className="block text-sm">Age band</label>
          <input name="age_band" placeholder="12-18m" defaultValue={initial?.age_band} className="w-full border p-2 rounded" required />
        </div>
      </div>

      <div><label className="block text-sm">Tags (comma separated)</label>
        <input name="tags" defaultValue={initial?.tags?.join(',') ?? ''} className="w-full border p-2 rounded" />
      </div>

      <div><label className="block text-sm">Why it matters</label>
        <textarea name="why_it_matters" defaultValue={initial?.why_it_matters ?? ''} className="w-full border p-2 rounded" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Image source</label>
          <select name="image_source" value={imageSource} onChange={e => setImageSource(e.target.value)} className="w-full border p-2 rounded">
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {isUploadOnly && <p className="text-xs mt-1 text-blue-700">Upload required for {imageSource}.</p>}
          {isUrlOnly && <p className="text-xs mt-1 text-blue-700">Paste an image URL allowed for {imageSource} (for eBay: https://i.ebayimg.com/...)</p>}
        </div>

        <div>
          <label className="block text-sm">Image URL (if feed/API)</label>
          <input name="image_url" defaultValue={initial?.image_url ?? ''} className="w-full border p-2 rounded"
                 disabled={isUploadOnly} placeholder={isUploadOnly ? 'Disabled for this source' : 'https://i.ebayimg.com/...'} />
        </div>
      </div>

      <div><label className="block text-sm">Proof of rights URL (for feeds/brand)</label>
        <input name="proof_of_rights_url" defaultValue={initial?.proof_of_rights_url ?? ''} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm">Upload (for brand_licensed / own_photo / stock_lifestyle)</label>
        <input type="file" name="file" accept="image/*" className="w-full" disabled={isUrlOnly} />
      </div>

      <div className="flex gap-2">
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white">{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={() => history.back()} className="px-4 py-2 rounded border">Cancel</button>
      </div>
    </form>
  );
}
