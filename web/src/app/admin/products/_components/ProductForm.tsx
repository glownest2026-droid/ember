'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateImage } from '../../../../lib/imagePolicy';
import type { Product } from '../../../../types/product';
import { createClient } from '../../../../utils/supabase/client';

const SOURCES = ['ebay_api','awin_feed','cj_feed','brand_licensed','own_photo','stock_lifestyle'] as const;

export default function ProductForm({ initial }: { initial?: Partial<Product> }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUploadToBucket(file: File) {
    // Ensure a filename exists
    const safeName = file.name?.trim() || 'image.jpg';
    const path = `manual/${Date.now()}-${safeName}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false });
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

      const image_source = String(fd.get('image_source') || '');
      const fileInput = form.elements.namedItem('file') as HTMLInputElement | null;
      const file = fileInput?.files?.[0] || null;

      let image_url = String(fd.get('image_url') || '');
      if (['brand_licensed','own_photo','stock_lifestyle'].includes(image_source)) {
        if (!file) {
          throw new Error('Please upload an image for this image source.');
        }
        image_url = await onUploadToBucket(file);
      }

      const p: any = {
        id: initial?.id,
        name: String(fd.get('name') || '').trim(),
        rating: Number(fd.get('rating')),
        age_band: String(fd.get('age_band') || '').trim(),
        tags: String(fd.get('tags') || '')
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        why_it_matters: String(fd.get('why_it_matters') || '') || null,
        affiliate_program: String(fd.get('affiliate_program') || '') || null,
        affiliate_deeplink: String(fd.get('affiliate_deeplink') || '') || null,
        image_source,
        image_url: image_url || null,
        proof_of_rights_url: String(fd.get('proof_of_rights_url') || '') || null,
      };

      if (!p.name) throw new Error('Name is required');
      if (!p.age_band) throw new Error('Age band is required');
      if (!Number.isFinite(p.rating)) throw new Error('Rating is required');
      if (p.rating < 4) throw new Error('Rating must be ≥ 4');

      const ok = validateImage(p.image_source, p.image_url ?? undefined, {
        affiliate_program: p.affiliate_program ?? undefined,
        proof: p.proof_of_rights_url ?? undefined,
      });
      if (!ok && p.image_source !== 'stock_lifestyle') {
        throw new Error('Image URL not permitted for selected source. Use bucket upload for own/brand images, or allowed feed/API URLs.');
      }

      const { error } = await supabase.from('products').upsert(p, { onConflict: 'id' });
      if (error) throw error;

      router.push('/admin/products');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      {error && <div className="rounded bg-red-100 p-2 text-red-700">{error}</div>}
      <div><label className="block text-sm">Name</label><input name="name" defaultValue={initial?.name} className="w-full border p-2 rounded" required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm">Rating (≥4)</label><input type="number" step="0.1" min="0" max="5" name="rating" defaultValue={initial?.rating ?? 4} className="w-full border p-2 rounded" required /></div>
        <div><label className="block text-sm">Age band</label><input name="age_band" placeholder="12-18m" defaultValue={initial?.age_band} className="w-full border p-2 rounded" required /></div>
      </div>
      <div><label className="block text-sm">Tags (comma separated)</label><input name="tags" defaultValue={initial?.tags?.join(',') ?? ''} className="w-full border p-2 rounded" /></div>
      <div><label className="block text-sm">Why it matters</label><textarea name="why_it_matters" defaultValue={initial?.why_it_matters ?? ''} className="w-full border p-2 rounded" rows={3} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Affiliate program</label>
          <select name="affiliate_program" defaultValue={initial?.affiliate_program ?? ''} className="w-full border p-2 rounded">
            <option value="">(none)</option><option value="ebay">eBay</option><option value="awin">Awin</option><option value="cj">CJ</option><option value="skimlinks">Skimlinks</option><option value="sovrn">Sovrn</option><option value="amazon">Amazon (later)</option><option value="direct">Direct</option>
          </select>
        </div>
        <div><label className="block text-sm">Affiliate deeplink</label><input name="affiliate_deeplink" defaultValue={initial?.affiliate_deeplink ?? ''} className="w-full border p-2 rounded" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Image source</label>
          <select name="image_source" defaultValue={initial?.image_source ?? 'stock_lifestyle'} className="w-full border p-2 rounded">
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="block text-sm">Image URL (if feed/API)</label><input name="image_url" defaultValue={initial?.image_url ?? ''} className="w-full border p-2 rounded" /></div>
      </div>
      <div><label className="block text-sm">Proof of rights URL (for feeds/brand)</label><input name="proof_of_rights_url" defaultValue={initial?.proof_of_rights_url ?? ''} className="w-full border p-2 rounded" /></div>
      <div><label className="block text-sm">Upload (for brand_licensed / own_photo / stock_lifestyle)</label><input type="file" name="file" accept="image/*" className="w-full" /></div>
      <div className="flex gap-2"><button disabled={saving} className="px-4 py-2 rounded bg-black text-white">{saving ? 'Saving…' : 'Save'}</button><button type="button" onClick={() => history.back()} className="px-4 py-2 rounded border">Cancel</button></div>
    </form>
  );
}
