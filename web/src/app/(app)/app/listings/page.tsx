"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Package, MapPin, Pencil, Trash2 } from "lucide-react";

interface ListingRow {
  id: string;
  raw_item_text: string | null;
  condition: string | null;
  postcode: string | null;
  radius_miles: number;
  status: string;
  created_at: string;
  item_type_name?: string | null;
  photos: { id: string; storage_path: string; preview_url?: string }[];
}

export default function MyListingsPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u ?? null);
      if (!u) {
        setLoading(false);
        return;
      }
      const { data: rows, error: e1 } = await supabase
        .from("marketplace_listings")
        .select(
          "id, raw_item_text, condition, postcode, radius_miles, status, created_at, selected_item_type_id"
        )
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      if (e1) {
        setError(e1.message);
        setLoading(false);
        return;
      }

      const withPhotos: ListingRow[] = await Promise.all(
        (rows ?? []).map(async (r) => {
          const { data: photos } = await supabase
            .from("marketplace_listing_photos")
            .select("id, storage_path")
            .eq("listing_id", r.id)
            .order("sort_order", { ascending: true });

          const withUrls = await Promise.all(
            (photos ?? []).map(async (p) => {
              const { data: signed } = await supabase.storage
                .from("marketplace-listing-photos")
                .createSignedUrl(p.storage_path, 3600);
              return {
                id: p.id,
                storage_path: p.storage_path,
                preview_url: signed?.signedUrl,
              };
            })
          );

          let item_type_name: string | null = null;
          if ((r as { selected_item_type_id?: string }).selected_item_type_id) {
            const { data: typeRow } = await supabase
              .from("marketplace_item_types")
              .select("canonical_name")
              .eq(
                "id",
                (r as { selected_item_type_id: string }).selected_item_type_id
              )
              .single();
            item_type_name = typeRow?.canonical_name ?? null;
          }

          return {
            id: r.id,
            raw_item_text: r.raw_item_text,
            condition: r.condition,
            postcode: r.postcode,
            radius_miles: r.radius_miles,
            status: r.status,
            created_at: r.created_at,
            item_type_name,
            photos: withUrls,
          };
        })
      );
      setListings(withPhotos);
      setLoading(false);
    })();
  }, []);

  const handleArchive = async (listingId: string, photoPaths: string[]) => {
    const supabase = createClient();
    await supabase
      .from("marketplace_listings")
      .update({ status: "archived" })
      .eq("id", listingId);
    await supabase
      .from("marketplace_listing_photos")
      .delete()
      .eq("listing_id", listingId);
    for (const path of photoPaths) {
      await supabase.storage
        .from("marketplace-listing-photos")
        .remove([path]);
    }
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[#5C646D]">Loading your listings…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-[#5C646D]">
          Please <Link className="underline text-primary" href="/signin">sign in</Link> to view your listings.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-normal text-[#1A1E23]">
          My pre-launch listings
        </h1>
        <Link
          href="/marketplace"
          className="text-sm font-medium text-primary hover:underline"
        >
          List an item
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-[#5C646D]" />
          <p className="text-[#1A1E23] font-medium mb-1">
            No listings yet
          </p>
          <p className="text-sm text-[#5C646D] mb-4">
            Pre-list items from the Marketplace page and they’ll appear here.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white bg-primary"
          >
            List an item
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex gap-4 flex-1 min-w-0">
                {listing.photos[0]?.preview_url ? (
                  <img
                    src={listing.photos[0].preview_url}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[#F1F3F2] flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-[#5C646D]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#1A1E23] truncate">
                    {listing.item_type_name || listing.raw_item_text || "Untitled item"}
                  </p>
                  {listing.condition && (
                    <p className="text-sm text-[#5C646D] capitalize">
                      {listing.condition.replace("-", " ")}
                    </p>
                  )}
                  <p className="text-sm text-[#5C646D] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.postcode || "Area set"} · {listing.radius_miles} miles
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-[#FFF5F3] text-primary">
                    Not public yet
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/marketplace?edit=${listing.id}`}
                  className="p-2 rounded-lg border border-[#E5E7EB] text-[#5C646D] hover:bg-[#FAFAFA]"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    handleArchive(
                      listing.id,
                      listing.photos.map((p) => p.storage_path)
                    )
                  }
                  className="p-2 rounded-lg border border-[#E5E7EB] text-[#5C646D] hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
