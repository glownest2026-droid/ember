"use client";

import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Camera, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const RAW_LISTING_BUCKET = "marketplace-raw-listing-photos";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type DraftRow = {
  id: string;
  image_storage_path: string | null;
};

type AuthUser = {
  id: string;
};

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export default function AppListingsPhotoDraftPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [imageStoragePath, setImageStoragePath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refreshSignedPreview = useCallback(async (path: string) => {
    const supabase = createClient();
    const { data, error: signedError } = await supabase.storage
      .from(RAW_LISTING_BUCKET)
      .createSignedUrl(path, 3600);
    if (signedError) {
      setPreviewUrl(null);
      setError(`Uploaded, but preview link failed: ${signedError.message}`);
      return;
    }
    setPreviewUrl(data?.signedUrl ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({ id: authUser.id });

      const { data: drafts, error: draftsError } = await supabase
        .from("marketplace_listing_drafts")
        .select("id, image_storage_path")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!active) return;

      if (draftsError) {
        setError(draftsError.message);
        setLoading(false);
        return;
      }

      const latest = (drafts?.[0] ?? null) as DraftRow | null;
      if (latest) {
        setDraftId(latest.id);
        setImageStoragePath(latest.image_storage_path);
        if (latest.image_storage_path) {
          await refreshSignedPreview(latest.image_storage_path);
        }
      }

      if (active) setLoading(false);
    };

    void boot();
    return () => {
      active = false;
    };
  }, [refreshSignedPreview]);

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setError(null);
    setSuccess(null);

    if (!file) return;
    if (!user) {
      setError("Please sign in to upload a listing photo.");
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large. Max file size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      let activeDraftId = draftId;

      if (!activeDraftId) {
        const { data: insertedDraft, error: insertDraftError } = await supabase
          .from("marketplace_listing_drafts")
          .insert({
            user_id: user.id,
            status: "draft",
          })
          .select("id")
          .single();

        if (insertDraftError || !insertedDraft?.id) {
          throw new Error(insertDraftError?.message ?? "Failed to create draft.");
        }

        activeDraftId = insertedDraft.id;
        setDraftId(activeDraftId);
      }

      const path = `${user.id}/${activeDraftId}/${Date.now()}-${crypto.randomUUID()}.${getFileExtension(file)}`;
      const { error: uploadError } = await supabase.storage
        .from(RAW_LISTING_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { error: updateDraftError } = await supabase
        .from("marketplace_listing_drafts")
        .update({ image_storage_path: path })
        .eq("id", activeDraftId)
        .eq("user_id", user.id);

      if (updateDraftError) throw new Error(updateDraftError.message);

      setImageStoragePath(path);
      await refreshSignedPreview(path);
      setSuccess("Photo uploaded privately to your draft.");
    } catch (uploadFlowError) {
      setError(uploadFlowError instanceof Error ? uploadFlowError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#5C646D]">Loading your listing draft…</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-[#5C646D]">
          Please{" "}
          <Link className="underline text-primary" href="/signin">
            sign in
          </Link>{" "}
          to upload a listing photo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-normal text-[#1A1E23]">Start a listing with a photo</h1>
        <p className="text-sm text-[#5C646D]">
          Upload one item photo to your private draft. Nothing is public and nothing is published.
        </p>
      </header>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1A1E23] bg-[#FAFAFA] border border-[#E5E7EB] rounded-full px-3 py-1.5">
          <Lock className="w-3.5 h-3.5" />
          Private storage only
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
              htmlFor="draft-photo-take"
            >
              <Camera className="w-4 h-4" />
              {uploading ? "Uploading..." : "Take photo"}
            </label>
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#1A1E23]"
              htmlFor="draft-photo-upload"
            >
              Choose from gallery
            </label>
          </div>
          <input
            id="draft-photo-take"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={handleFileSelected}
            disabled={uploading}
          />
          <input
            id="draft-photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelected}
            disabled={uploading}
          />
          <p className="mt-2 text-xs text-[#5C646D]">Allowed: JPG, PNG, WebP. Max size: 10MB.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}

        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
          <p className="text-xs text-[#5C646D] mb-2">
            Draft ID: <span className="font-mono">{draftId ?? "will be created on first upload"}</span>
          </p>
          <p className="text-xs text-[#5C646D] break-all">
            Image path: <span className="font-mono">{imageStoragePath ?? "none yet"}</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-base font-medium text-[#1A1E23] mb-3">Owner preview</h2>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Your uploaded listing draft photo" className="w-full max-h-[420px] object-contain rounded-xl border border-[#E5E7EB]" />
        ) : (
          <p className="text-sm text-[#5C646D]">Upload a photo to preview it here.</p>
        )}
      </div>

      <p className="text-xs text-[#5C646D]">
        This flow does not run AI analysis, does not publish listings, and does not expose public photo URLs.
      </p>
    </div>
  );
}
