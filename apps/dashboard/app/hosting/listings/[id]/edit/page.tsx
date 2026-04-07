"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";

type Section = "photos" | "title" | "pricing" | "location" | "basics";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ListingEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listingId = decodeURIComponent(String(id ?? "")).trim();
  const router = useRouter();

  const [section, setSection] = useState<Section>("photos");
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [photosDraft, setPhotosDraft] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const [priceDraft, setPriceDraft] = useState("");
  const [securityChargeDraft, setSecurityChargeDraft] = useState("");
  const [otherChargesDraft, setOtherChargesDraft] = useState("");
  const [paymentFrequencyDraft, setPaymentFrequencyDraft] = useState<Listing["paymentFrequency"]>("MONTHLY");

  const [streetDraft, setStreetDraft] = useState("");
  const [districtDraft, setDistrictDraft] = useState("");
  const [cityDraft, setCityDraft] = useState("");
  const [provinceDraft, setProvinceDraft] = useState("");

  const [guestsDraft, setGuestsDraft] = useState("");
  const [bedroomsDraft, setBedroomsDraft] = useState("");
  const [bedsDraft, setBedsDraft] = useState("");
  const [hasLockDraft, setHasLockDraft] = useState<boolean | null>(null);

  const coverPhoto = useMemo(() => {
    return photosDraft?.[0] || listing?.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";
  }, [listing?.photos, photosDraft]);

  const load = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingId)}`, { cache: "no-store" });
      if (!res.ok) {
        setListing(null);
        setError("Listing not found.");
        return;
      }
      const data = (await res.json()) as { listing: Listing };
      const l = data.listing;
      setListing(l);
      setPhotosDraft(Array.isArray(l.photos) ? l.photos : []);
      setTitleDraft(l.title ?? "");
      setDescriptionDraft(l.description ?? "");
      setPriceDraft(String(l.price ?? ""));
      setSecurityChargeDraft(String(l.securityCharge ?? ""));
      setOtherChargesDraft(String(l.otherCharges ?? ""));
      setPaymentFrequencyDraft(l.paymentFrequency ?? "MONTHLY");
      setStreetDraft(l.address?.street ?? "");
      setDistrictDraft(l.address?.district ?? "");
      setCityDraft(l.address?.city ?? "");
      setProvinceDraft(l.address?.province ?? "");
      setGuestsDraft(String(l.basics?.guests ?? ""));
      setBedroomsDraft(String(l.basics?.bedrooms ?? ""));
      setBedsDraft(String(l.basics?.beds ?? ""));
      setHasLockDraft(typeof l.basics?.hasLock === "boolean" ? l.basics.hasLock : null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [listingId]);

  const save = async (updates: Partial<Listing>) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        setError("Failed to save changes.");
        return;
      }
      const data = (await res.json()) as { listing: Listing };
      setListing(data.listing);
    } finally {
      setSaving(false);
    }
  };

  const deleteListing = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const reason = deleteReason.trim();
      if (!reason) {
        setDeleteError("Tell us why you’re deleting this listing.");
        return;
      }
      const res = await fetch(`/api/listings/${encodeURIComponent(listingId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        setDeleteError("Failed to delete listing. Please try again.");
        return;
      }
      setDeleteOpen(false);
      router.push("/hosting/listings");
    } finally {
      setDeleting(false);
    }
  };

  const addSamplePhoto = () => {
    const samples = [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    ];
    const next = samples[Math.floor(Math.random() * samples.length)];
    if (!next) return;
    setPhotosDraft((prev) => [...prev, next]);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="h-6 w-40 bg-slate-200 rounded-lg animate-pulse" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <div className="h-[540px] bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-[540px] bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ph-bold ph-warning-circle text-3xl text-slate-500"></i>
          </div>
          <div className="text-xl font-display font-bold text-slate-900">Listing not found</div>
          <div className="text-slate-500 mt-2">{error || "This listing doesn’t exist."}</div>
          <Link href="/hosting/listings" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
            <i className="ph-bold ph-arrow-left"></i>
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const navItems: Array<{ id: Section; label: string; desc: string; icon: string }> = [
    { id: "photos", label: "Photos", desc: "Manage your photo tour", icon: "ph-images" },
    { id: "title", label: "Title & description", desc: "What guests see first", icon: "ph-text-aa" },
    { id: "pricing", label: "Pricing", desc: "Nightly or monthly rates", icon: "ph-currency-ngn" },
    { id: "location", label: "Location", desc: "Address details", icon: "ph-map-pin" },
    { id: "basics", label: "Your space", desc: "Guests, beds, and more", icon: "ph-bed" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/hosting/listings"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            aria-label="Back"
          >
            <i className="ph-bold ph-arrow-left"></i>
          </Link>
          <div>
            <div className="text-xl md:text-2xl font-display font-bold text-slate-900">Listing editor</div>
            <div className="text-sm text-slate-500 line-clamp-1">{listing.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${encodeURIComponent(String(listing.id))}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <i className="ph-bold ph-eye"></i>
            View
          </Link>
          <button
            type="button"
            onClick={() => {
              setDeleteReason("");
              setDeleteError("");
              setDeleteOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors"
          >
            <i className="ph-bold ph-trash"></i>
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button type="button" className="px-4 py-2 rounded-full bg-slate-900 text-white font-bold text-sm">
                Your space
              </button>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-500 font-bold text-sm opacity-60 cursor-not-allowed"
              >
                Arrival guide
              </button>
              <button
                type="button"
                disabled
                className="ml-auto w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 opacity-60 cursor-not-allowed"
                aria-label="Settings"
              >
                <i className="ph-bold ph-gear-six"></i>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                <img src={coverPhoto} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="text-white font-bold text-sm line-clamp-1">{listing.title}</div>
                  <div className="text-white font-bold text-sm">₦{Number(listing.price).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {navItems.map((item) => {
              const isActive = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                    isActive ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-brand-50 hover:border-brand-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
                      <i className={`ph-bold ${item.icon}`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{item.desc}</div>
                    </div>
                    <i className="ph ph-caret-right text-slate-400 mt-2"></i>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-display font-bold text-slate-900">
                {section === "photos"
                  ? "Photo tour"
                  : section === "title"
                    ? "Title & description"
                    : section === "pricing"
                      ? "Pricing"
                      : section === "location"
                        ? "Location"
                        : "Your space"}
              </div>
              <div className="text-sm text-slate-500">
                {section === "photos"
                  ? "Manage photos and add details. Guests will only see your tour if every room has a photo."
                  : section === "title"
                    ? "Update your title and description so guests know what to expect."
                    : section === "pricing"
                      ? "Update price and charges for this listing."
                      : section === "location"
                        ? "Update your address details."
                        : "Update the basics of your space."}
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                if (section === "photos") {
                  await save({ photos: photosDraft });
                } else if (section === "title") {
                  await save({ title: titleDraft.trim(), description: descriptionDraft });
                } else if (section === "pricing") {
                  await save({
                    price: Number(priceDraft || 0),
                    securityCharge: Number(securityChargeDraft || 0),
                    otherCharges: Number(otherChargesDraft || 0),
                    paymentFrequency: paymentFrequencyDraft,
                  });
                } else if (section === "location") {
                  await save({
                    address: {
                      ...listing.address,
                      street: streetDraft,
                      district: districtDraft,
                      city: cityDraft,
                      province: provinceDraft,
                    },
                  });
                } else {
                  await save({
                    basics: {
                      ...listing.basics,
                      guests: Number(guestsDraft || 0),
                      bedrooms: Number(bedroomsDraft || 0),
                      beds: Number(bedsDraft || 0),
                      hasLock: hasLockDraft,
                    },
                  });
                }
              }}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <i className="ph-bold ph-floppy-disk"></i>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="p-6 md:p-8">
            {error ? (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            {section === "photos" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-slate-700">All photos</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addSamplePhoto}
                      className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      Add sample
                    </button>
                    <label className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors cursor-pointer inline-flex items-center gap-2">
                      <i className="ph-bold ph-plus"></i>
                      Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files ?? []);
                          if (files.length === 0) return;
                          const urls = await Promise.all(files.map(readFileAsDataUrl));
                          setPhotosDraft((prev) => [...prev, ...urls.filter(Boolean)]);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    <i className="ph ph-link text-slate-400"></i>
                    <input
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Paste an image URL to add"
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = newPhotoUrl.trim();
                        if (!url) return;
                        setPhotosDraft((prev) => [...prev, url]);
                        setNewPhotoUrl("");
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {photosDraft.length === 0 ? (
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
                      <i className="ph-bold ph-image text-3xl text-slate-500"></i>
                    </div>
                    <div className="font-display font-bold text-slate-900 text-xl">Add some photos</div>
                    <div className="text-slate-500 mt-2">Upload images or paste links to create your photo tour.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photosDraft.map((src, idx) => (
                      <motion.div key={`${src}:${idx}`} whileHover={{ y: -2 }} className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                          <img src={src} className="w-full h-full object-cover" />
                          {idx === 0 ? (
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 border border-white/50 backdrop-blur-md text-slate-800">
                                <i className="ph-fill ph-star"></i>
                                Cover
                              </span>
                            </div>
                          ) : null}
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPhotosDraft((prev) => {
                                  const next = [...prev];
                                  next.splice(idx, 1);
                                  return next;
                                });
                              }}
                              className="w-9 h-9 rounded-full bg-white/90 border border-white/50 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
                              aria-label="Remove photo"
                            >
                              <i className="ph-bold ph-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between gap-3">
                          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Photo {idx + 1}</div>
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotosDraft((prev) => {
                                  const next = [...prev];
                                  const [picked] = next.splice(idx, 1);
                                  if (picked) next.unshift(picked);
                                  return next;
                                });
                              }}
                              className="text-sm font-bold text-brand-700 hover:text-brand-800"
                            >
                              Set cover
                            </button>
                          ) : (
                            <span className="text-sm font-bold text-slate-400">Set cover</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {section === "title" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">Title</div>
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    placeholder="Give your listing a title"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">Description</div>
                  <textarea
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    placeholder="Describe your place"
                  />
                </div>
              </div>
            ) : null}

            {section === "pricing" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Price (₦)</div>
                    <input
                      value={priceDraft}
                      onChange={(e) => setPriceDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Payment frequency</div>
                    <select
                      value={paymentFrequencyDraft}
                      onChange={(e) => setPaymentFrequencyDraft(e.target.value as Listing["paymentFrequency"])}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 bg-white"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Security charge (₦)</div>
                    <input
                      value={securityChargeDraft}
                      onChange={(e) => setSecurityChargeDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Other charges (₦)</div>
                    <input
                      value={otherChargesDraft}
                      onChange={(e) => setOtherChargesDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {section === "location" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">Street</div>
                  <input
                    value={streetDraft}
                    onChange={(e) => setStreetDraft(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">District</div>
                    <input
                      value={districtDraft}
                      onChange={(e) => setDistrictDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">City</div>
                    <input
                      value={cityDraft}
                      onChange={(e) => setCityDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">State</div>
                  <input
                    value={provinceDraft}
                    onChange={(e) => setProvinceDraft(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                  />
                </div>
              </div>
            ) : null}

            {section === "basics" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Guests</div>
                    <input
                      value={guestsDraft}
                      onChange={(e) => setGuestsDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Bedrooms</div>
                    <input
                      value={bedroomsDraft}
                      onChange={(e) => setBedroomsDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Beds</div>
                    <input
                      value={bedsDraft}
                      onChange={(e) => setBedsDraft(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900">Door lock</div>
                      <div className="text-sm text-slate-500 mt-1">Let guests know if rooms have locks.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHasLockDraft(true)}
                        className={`px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                          hasLockDraft === true
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasLockDraft(false)}
                        className={`px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                          hasLockDraft === false
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {deleteOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-900">Delete listing</div>
                <div className="text-sm text-slate-500">This can’t be undone. Tell us why you’re deleting it.</div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
                disabled={deleting}
              >
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-700">Reason</div>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 min-h-[120px] resize-none"
                  placeholder="e.g. I listed the wrong address, property is no longer available, duplicate listing..."
                />
              </div>
              {deleteError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-700">
                  {deleteError}
                </div>
              ) : null}
            </div>
            <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteListing}
                className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete listing"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
