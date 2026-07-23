import "server-only";

const RAW_LISTING_BUCKET = "marketplace-raw-listing-photos";
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const MAX_LISTING_IMAGE_BYTES = 10 * 1024 * 1024;

export { RAW_LISTING_BUCKET };

export function inferListingImageMimeType(path: string, blobType: string): string {
  if (blobType && blobType.length > 0) return blobType;
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export type PreparedDraftImage = {
  bucket: string;
  path: string;
  bytes: number;
  mimeType: string;
  base64: string;
  base64Length: number;
};

export async function downloadOwnedDraftImage(args: {
  supabase: Pick<import("@supabase/supabase-js").SupabaseClient, "storage">;
  userId: string;
  imagePath: string;
}): Promise<{ ok: true; image: PreparedDraftImage } | { ok: false; code: string; message: string }> {
  const imagePath = args.imagePath.trim();
  if (!imagePath) {
    return { ok: false, code: "draft_missing_image", message: "Draft has no image path." };
  }
  if (!imagePath.startsWith(`${args.userId}/`)) {
    return { ok: false, code: "draft_path_forbidden", message: "Draft photo path is invalid for this user." };
  }

  const { data: imageBlob, error: downloadError } = await args.supabase.storage
    .from(RAW_LISTING_BUCKET)
    .download(imagePath);

  if (downloadError || !imageBlob) {
    return {
      ok: false,
      code: "listing_image_download_failed",
      message: "Ember could not read the private draft photo.",
    };
  }

  const mimeType = inferListingImageMimeType(imagePath, imageBlob.type);
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    return { ok: false, code: "image_type_unsupported", message: "Unsupported image format." };
  }

  const imageBytes = Buffer.from(await imageBlob.arrayBuffer());
  if (!imageBytes.length) {
    return { ok: false, code: "image_empty", message: "Draft photo is empty." };
  }
  if (imageBytes.length > MAX_LISTING_IMAGE_BYTES) {
    return { ok: false, code: "image_too_large", message: "Draft photo exceeds the 10MB limit." };
  }

  const base64 = imageBytes.toString("base64");
  return {
    ok: true,
    image: {
      bucket: RAW_LISTING_BUCKET,
      path: imagePath,
      bytes: imageBytes.length,
      mimeType,
      base64,
      base64Length: base64.length,
    },
  };
}
