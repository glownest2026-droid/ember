"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Baby,
  MapPin,
  TrendingUp,
  Lightbulb,
  ShoppingBag,
  RefreshCw,
  Lock,
  Info,
  Settings,
  MessageCircle,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { NotificationAnimation } from "@/components/figma/marketplace/NotificationAnimation";
import { SellSuggestions } from "@/components/figma/marketplace/SellSuggestions";
import { Button } from "@/components/figma/marketplace/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/figma/marketplace/ui/accordion";
import { ListingWidget } from "@/components/figma/marketplace-prelist/ListingWidget";
import { ListingModal } from "@/components/figma/marketplace-prelist/ListingModal";
import { SuccessModal } from "@/components/figma/marketplace-prelist/SuccessModal";
import type { ListingData } from "@/components/figma/marketplace-prelist/types";

/**
 * Marketplace marketing page — Figma Make exact implementation.
 * Route: /marketplace. Uses existing app shell (ConditionalHeader + SubnavGate from root layout).
 * Logged-in: prelist widget above hero; List an item opens modal → backend (PR1).
 */
type ChildRow = { id: string; child_name?: string; display_name?: string; age_band?: string; gender?: string };

function childDisplayName(c: ChildRow, index: number): string {
  const raw = c as Record<string, unknown>;
  const name = (
    (raw.child_name ?? raw.childName ?? raw.display_name ?? raw.displayName ?? "") as string
  ).trim();
  if (name) return name;
  const g = ((raw.gender as string) ?? "").trim().toLowerCase();
  if (g === "male") return "Boy";
  if (g === "female") return "Girl";
  return `Child ${index + 1}`;
}

export default function MarketplacePage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [childrenLoaded, setChildrenLoaded] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChildName, setSelectedChildName] = useState("your child");
  const [ageBandLabel, setAgeBandLabel] = useState<string | undefined>(undefined);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<ListingData | null>(null);
  const [editListingId, setEditListingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ListingData> | null>(null);
  const [editPhotos, setEditPhotos] = useState<{ id: string; storagePath: string; previewUrl?: string }[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const setLoaded = () => setChildrenLoaded(true);
    const fetchChildren = () => {
      setChildrenLoaded(false);
      supabase
        .from("children")
        .select("id, child_name, age_band, gender")
        .eq("is_suppressed", false)
        .order("created_at", { ascending: true })
        .then(({ data, error }) => {
          if (!error && Array.isArray(data)) {
            setChildren(
              (data as ChildRow[]).map((r) => ({
                ...r,
                display_name: (r as Record<string, unknown>).display_name as string | undefined,
              }))
            );
            setLoaded();
            return;
          }
          supabase
            .from("children")
            .select("id, display_name, age_band, gender")
            .eq("is_suppressed", false)
            .order("created_at", { ascending: true })
            .then(({ data: data2, error: err2 }) => {
              if (!err2 && Array.isArray(data2)) {
                setChildren(
                  (data2 as Record<string, unknown>[]).map((r) => ({
                    id: r.id as string,
                    child_name: r.display_name as string | undefined,
                    display_name: r.display_name as string | undefined,
                    age_band: r.age_band as string | undefined,
                    gender: r.gender as string | undefined,
                  }))
                );
                setLoaded();
                return;
              }
              supabase
                .from("children")
                .select("id, gender, age_band")
                .eq("is_suppressed", false)
                .order("created_at", { ascending: true })
                .then(({ data: fallback }) => {
                  setChildren(
                    Array.isArray(fallback)
                      ? (fallback as Record<string, unknown>[]).map((r) => ({
                          id: r.id as string,
                          child_name: undefined,
                          display_name: undefined,
                          age_band: r.age_band as string | undefined,
                          gender: r.gender as string | undefined,
                        }))
                      : []
                  );
                  setLoaded();
                });
            });
        });
    };
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null);
      if (!u) {
        setChildrenLoaded(true);
        return;
      }
      fetchChildren();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        setChildren([]);
        setChildrenLoaded(false);
        return;
      }
      fetchChildren();
    });
    return () => subscription.unsubscribe();
  }, []);

  const childParam = searchParams.get("child");
  useEffect(() => {
    if (!childrenLoaded) return;
    if (children.length === 0) {
      if (!childParam) {
        setSelectedChildId(null);
        setSelectedChildName("your child");
        setAgeBandLabel(undefined);
      } else {
        const supabase = createClient();
        supabase
          .from("children")
          .select("id, child_name, display_name, age_band, gender")
          .eq("id", childParam)
          .eq("is_suppressed", false)
          .single()
          .then(({ data: one }) => {
            if (one) {
              const row = one as ChildRow;
              setSelectedChildId(row.id);
              setSelectedChildName(childDisplayName(row, 0));
              setAgeBandLabel(row.age_band ?? undefined);
            } else {
              setSelectedChildId(null);
              setSelectedChildName("your child");
              setAgeBandLabel(undefined);
            }
          });
      }
      return;
    }
    const match: ChildRow | null = childParam ? children.find((c) => c.id === childParam) ?? null : null;
    if (match) {
      setSelectedChildId(match.id);
      const idx = children.indexOf(match);
      setSelectedChildName(childDisplayName(match, idx >= 0 ? idx : 0));
      setAgeBandLabel((match.age_band as string) ?? undefined);
    } else if (childParam) {
      setSelectedChildId(childParam);
      const supabase = createClient();
      supabase
        .from("children")
        .select("id, child_name, display_name, age_band, gender")
        .eq("id", childParam)
        .eq("is_suppressed", false)
        .single()
        .then(({ data: one }) => {
          if (one) {
            const row = one as ChildRow;
            setSelectedChildName(childDisplayName(row, 0));
            setAgeBandLabel(row.age_band ?? undefined);
          } else {
            setSelectedChildName("your child");
            setAgeBandLabel(undefined);
          }
        });
    } else {
      setSelectedChildId(null);
      setSelectedChildName("your child");
      setAgeBandLabel(undefined);
    }
  }, [children, childParam, childrenLoaded]);

  const editId = searchParams.get("edit");
  useEffect(() => {
    if (!editId || !user) {
      setEditListingId(null);
      setEditFormData(null);
      setEditPhotos([]);
      return;
    }
    const supabase = createClient();
    (async () => {
      const { data: row, error } = await supabase
        .from("marketplace_listings")
        .select("id, raw_item_text, condition, notes, postcode, radius_miles, selected_item_type_id")
        .eq("id", editId)
        .eq("user_id", user.id)
        .single();
      if (error || !row) {
        setEditListingId(null);
        return;
      }
      setEditListingId(row.id);
      setEditFormData({
        itemName: row.raw_item_text ?? "",
        condition: row.condition ?? "",
        notes: row.notes ?? "",
        postcode: row.postcode ?? "",
        radius: row.radius_miles != null ? String(row.radius_miles) : "5",
        selectedItemTypeId: (row as { selected_item_type_id?: string }).selected_item_type_id ?? null,
      });
      const { data: photoRows } = await supabase
        .from("marketplace_listing_photos")
        .select("id, storage_path")
        .eq("listing_id", row.id)
        .order("sort_order", { ascending: true });
      const withUrls = await Promise.all(
        (photoRows ?? []).map(async (p) => {
          const { data: signed } = await supabase.storage
            .from("marketplace-listing-photos")
            .createSignedUrl(p.storage_path, 3600);
          return { id: p.id, storagePath: p.storage_path, previewUrl: signed?.signedUrl };
        })
      );
      setEditPhotos(withUrls);
      setListingModalOpen(true);
    })();
  }, [editId, user?.id]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Prelist widget (logged-in only) */}
      {user && (
        <section className="pt-8 pb-0">
          <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
            <ListingWidget
              selectedChildName={selectedChildName}
              ageBandLabel={ageBandLabel}
              onListItem={() => setListingModalOpen(true)}
            />
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="bg-white border-b border-[#E5E7EB] pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 lg:pr-8">
              <motion.h1
                className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-normal leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#1A1E23]">Trade items for young ones</span>
                <br />
                <span className="text-primary">without the guesswork</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-[#5C646D] leading-relaxed font-light max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Stage-aware recommendations that match you with nearby families — so you buy the right next things, and pass on what you&apos;re done with.
              </motion.p>

              <motion.p
                className="text-base text-[#5C646D] font-light italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                One calming loop for busy parents
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF5F3] border border-primary/20"
              >
                <Calendar className="h-4 w-4 text-primary" strokeWidth={2} />
                <span className="text-sm font-medium text-primary">Coming Soon</span>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <Button size="lg" asChild>
                  <Link href="/success">Join early access</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm text-[#5C646D] hover:text-primary font-medium underline underline-offset-4 transition-colors duration-300"
                >
                  How it works
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <NotificationAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-3 leading-[1.1] tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-[#5C646D] font-light">Three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-8 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5F3] mb-4">
                <Lightbulb className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1E23] mb-3">Know it</h3>
              <p className="text-sm text-[#5C646D] leading-relaxed font-light mb-4">
                Set your child&apos;s stage
              </p>
              <div className="bg-[#FAFAFA] rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#5C646D] mb-2 font-medium">Mechanism:</p>
                <p className="text-sm text-[#1A1E23] font-light">
                  Add your child&apos;s birth month → we tailor what&apos;s next
                </p>
              </div>
              <p className="text-xs text-primary font-medium mt-3">✓ We&apos;ll tailor matches to your stage</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-8 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5F3] mb-4">
                <ShoppingBag className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1E23] mb-3">Match it</h3>
              <p className="text-sm text-[#5C646D] leading-relaxed font-light mb-4">
                See nearby matches
              </p>
              <div className="bg-[#FAFAFA] rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#5C646D] mb-2 font-medium">Mechanism:</p>
                <p className="text-sm text-[#1A1E23] font-light">
                  We surface nearby listings that fit your stage (and suggest what to list)
                </p>
              </div>
              <p className="text-xs text-primary font-medium mt-3">✓ See what&apos;s nearby</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-8 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5F3] mb-4">
                <RefreshCw className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-medium text-[#1A1E23] mb-3">Move it on</h3>
              <p className="text-sm text-[#5C646D] leading-relaxed font-light mb-4">
                Sell in minutes
              </p>
              <div className="bg-[#FAFAFA] rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#5C646D] mb-2 font-medium">Mechanism:</p>
                <p className="text-sm text-[#1A1E23] font-light">
                  List quickly and chat directly — simple peer-to-peer handover
                </p>
              </div>
              <p className="text-xs text-primary font-medium mt-3">✓ List in minutes</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-3 leading-[1.1] tracking-tight">
              Trust & safety
            </h2>
            <p className="text-lg text-[#5C646D] font-light">Calm, private, and transparent</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { Icon: Lock, title: "Privacy-first", text: "Child details stay private and are never shared publicly" },
              { Icon: Info, title: "Transparent matching", text: "We show why something matches your child's stage" },
              { Icon: Settings, title: "Full control", text: "Choose your search radius and notification settings" },
              { Icon: MessageCircle, title: "Peer-to-peer clarity", text: "You arrange pickup and payment directly with other families" },
              { Icon: ShieldCheck, title: "Safety guidance", text: "Clear tips for safe exchanges and smart meetups" },
              { Icon: MapPin, title: "Local matching", text: "See items near you that match your child's current stage" },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF5F3] mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-medium text-[#1A1E23] mb-2">{title}</h3>
                <p className="text-sm text-[#5C646D] font-light">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 text-center">
            <p className="text-sm text-[#5C646D] font-light leading-relaxed">
              Ember helps you discover and match items. Buying and selling is arranged directly between families.
            </p>
          </div>
        </div>
      </section>

      {/* Pre-launch Preview - Sell suggestions */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF5F3] border border-primary/20 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-3 leading-[1.1] tracking-tight">
              What the marketplace will help with
            </h2>
            <p className="text-lg text-[#5C646D] font-light max-w-2xl mx-auto">
              Stage-aware prompts to help you buy the right next things — and pass on what you&apos;re done with
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <SellSuggestions />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-3 leading-[1.1] tracking-tight">
              Common questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                When does the marketplace launch?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                We&apos;re launching in Spring 2026. Join early access to be notified as soon as we go live in your area. Early members will get priority access and exclusive features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                How does buying and selling work?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                Ember is a peer-to-peer marketplace. We help you find stage-matched items nearby and suggest what to sell, but you arrange pickup and payment directly with other families. Think of it like a stage-aware local community board.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                How do recommendations work?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                We match toys and books to your child&apos;s developmental stage using birth month + category fit + proximity. Every suggestion includes a &quot;why this match?&quot; explanation showing what skills it supports. This helps you buy things that fit where your child is now — and know when to pass them on.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                Is early access free?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                Yes, joining early access is completely free. There&apos;s no payment required and no commitment. We&apos;ll simply notify you when we launch and give you priority access to the marketplace.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                Do you verify listings or handle payments?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                No — Ember helps you match items based on stage and proximity, but we don&apos;t verify individual listings or process transactions. You choose how to transact (cash, bank transfer, etc.) and arrange the handover directly. We provide safety tips to help you make smart choices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white border border-[#E5E7EB] rounded-2xl px-6">
              <AccordionTrigger className="text-left hover:no-underline text-[#1A1E23] font-medium">
                Will this work in my area?
              </AccordionTrigger>
              <AccordionContent className="text-[#5C646D] font-light leading-relaxed">
                We&apos;re launching across the UK starting Spring 2026. When you join early access, we&apos;ll ask for your postcode so we can notify you when we go live in your area. The more local members we have, the better the marketplace works.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#1A1E23] to-[#2A2E33] text-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal mb-6 leading-[1.1] tracking-tight">
            Join UK parents getting early access
          </h2>
          <p className="text-lg sm:text-xl text-[#E5E7EB] mb-2 max-w-2xl mx-auto font-light">
            Be first to experience stage-matched trading
          </p>
          <p className="text-sm text-[#E5E7EB]/70 mb-8 max-w-2xl mx-auto font-light">
            Coming Soon
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-[#1A1E23] hover:bg-[#F1F3F2]">
            <Link href="/success">Join early access</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-12 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-[#1A1E23] mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-[#5C646D]">
                <li><Link href="/discover" className="hover:text-primary transition-colors duration-300">Discover</Link></li>
                <li><Link href="/marketplace" className="hover:text-primary transition-colors duration-300">Marketplace</Link></li>
                <li><Link href="/discover" className="hover:text-primary transition-colors duration-300">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1A1E23] mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-[#5C646D]">
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">About</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">Trust & Safety</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1A1E23] mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-[#5C646D]">
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">Privacy</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors duration-300">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#1A1E23] mb-3">Ember</h3>
              <p className="text-sm text-[#5C646D] font-light">
                Peer-to-peer marketplace for UK parents
              </p>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] pt-8 text-center text-sm text-[#5C646D]">
            © 2026 Ember. Made with care for UK families.
          </div>
        </div>
      </footer>

      {user && (
        <>
          <ListingModal
            isOpen={listingModalOpen}
            onClose={() => {
              setListingModalOpen(false);
              setEditListingId(null);
              setEditFormData(null);
              setEditPhotos([]);
            }}
            onComplete={(data) => {
              setSubmittedListing(data);
              setListingModalOpen(false);
              setSuccessModalOpen(true);
              setEditListingId(null);
              setEditFormData(null);
              setEditPhotos([]);
            }}
            selectedChildId={selectedChildId}
            selectedChildName={selectedChildName}
            initialListingId={editListingId}
            initialFormData={editFormData}
            initialPhotos={editPhotos}
          />
          <SuccessModal
            isOpen={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            listing={submittedListing}
            onListAnother={() => {
              setSuccessModalOpen(false);
              setListingModalOpen(true);
            }}
            selectedChildName={selectedChildName}
          />
        </>
      )}
    </div>
  );
}
