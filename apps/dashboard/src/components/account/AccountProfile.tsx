"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

type Mode = "host" | "guest";

export function AccountProfile({ mode }: { mode: Mode }) {
  const { user, completeProfile, isLoading } = useAuth();
  const [modal, setModal] = useState<null | "name" | "phone">(null);
  const [fullNameDraft, setFullNameDraft] = useState("");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const badge = useMemo(() => {
    const isHost = mode === "host";
    return {
      label: isHost ? "Host" : "Guest User",
      className: isHost ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-slate-50 text-slate-700 border-slate-200",
      icon: isHost ? "ph-storefront" : "ph-magnifying-glass",
    };
  }, [mode]);

  const quickLinks = useMemo(() => {
    if (mode === "host") {
      return [
        { label: "Create listing", href: "/becoming-a-host", icon: "ph-plus" },
        { label: "Your listings", href: "/hosting/listings", icon: "ph-storefront" },
        { label: "Calendar", href: "/hosting/calendar", icon: "ph-calendar" },
        { label: "Messages", href: "/hosting/messages", icon: "ph-chats" },
        { label: "Hosting dashboard", href: "/hosting", icon: "ph-house-line" },
      ];
    }
    return [
      { label: "Wishlists", href: "/user/favorites", icon: "ph-heart" },
      { label: "Trips", href: "/user/bookings", icon: "ph-suitcase" },
      { label: "Messages", href: "/user/messages", icon: "ph-chats" },
      { label: "Roommates", href: "/user/roommates", icon: "ph-users-three" },
      { label: "Browse homes", href: "/", icon: "ph-house-line" },
    ];
  }, [mode]);

  const settingsHref = mode === "host" ? "/hosting/settings" : "/user/settings";

  const setupItems = useMemo(() => {
    const emailOk = (user?.verifications?.email?.status ?? "UNVERIFIED") === "VERIFIED";
    const phoneOk = (user?.verifications?.phone?.status ?? "UNVERIFIED") === "VERIFIED";
    const idOk = (user?.verifications?.id?.status ?? "UNVERIFIED") === "VERIFIED";
    const usernameOk = Boolean(user?.username?.trim());
    const withdrawalOk = false;
    return [
      {
        title: "Identity verification",
        desc: "Get a verified badge and earn trust.",
        done: idOk,
        icon: "ph-identification-badge",
        href: settingsHref,
      },
      {
        title: "Verify phone number",
        desc: "Enable messages and booking updates.",
        done: phoneOk,
        icon: "ph-phone",
        href: settingsHref,
      },
      {
        title: "Add a username",
        desc: "Used for your public profile and sharing.",
        done: usernameOk,
        icon: "ph-user",
        href: settingsHref,
      },
      {
        title: "Add withdrawal account",
        desc: "Get paid faster (coming soon).",
        done: withdrawalOk,
        icon: "ph-bank",
        href: settingsHref,
      },
      {
        title: "Email verified",
        desc: user?.email ? String(user.email) : "Confirm your email address.",
        done: emailOk,
        icon: "ph-envelope-simple",
        href: settingsHref,
      },
    ];
  }, [settingsHref, user?.email, user?.username, user?.verifications?.email?.status, user?.verifications?.id?.status, user?.verifications?.phone?.status]);

  const canEdit = Boolean(user?.id);

  const closeModal = () => {
    setModal(null);
    setModalError("");
  };

  const openName = () => {
    setFullNameDraft(user?.name ?? "");
    setModalError("");
    setModal("name");
  };

  const openPhone = () => {
    setPhoneDraft(user?.phone ?? "");
    setModalError("");
    setModal("phone");
  };

  const saveName = async () => {
    if (!canEdit) return;
    setSaving(true);
    setModalError("");
    try {
      const value = fullNameDraft.trim();
      if (!value) {
        setModalError("Name is required.");
        return;
      }
      await completeProfile({ name: value });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const savePhone = async () => {
    if (!canEdit) return;
    setSaving(true);
    setModalError("");
    try {
      const value = phoneDraft.trim();
      if (!value) {
        setModalError("Phone number is required.");
        return;
      }
      await completeProfile({ phone: value });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">Profile</h1>
        <p className="text-slate-500">Manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-slate-900 text-lg truncate">{user?.name || "User"}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}>
                    <i className={`ph-bold ${badge.icon}`}></i>
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</div>
              <div className="text-sm font-semibold text-slate-800 break-all">{user?.email || "Not set"}</div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={openName}
                disabled={!canEdit || isLoading}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit profile
              </button>
              <Link
                href={settingsHref}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-center"
              >
                Settings
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-bold text-slate-900">Quick links</div>
                <div className="text-sm text-slate-500">{mode === "host" ? "Hosting tools" : "Guest tools"}</div>
              </div>
            </div>
            <div className="space-y-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-brand-50 hover:border-brand-200 transition-colors"
                >
                  <i className={`ph-bold ${l.icon} text-lg text-slate-600`}></i>
                  <span className="font-semibold text-slate-800">{l.label}</span>
                  <i className="ph ph-caret-right ml-auto text-slate-400"></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">Personal information</h2>
                <p className="text-sm text-slate-500">Keep your details up to date</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-slate-700">Full name</div>
                  <button
                    type="button"
                    onClick={openName}
                    className="text-sm font-bold text-brand-600 hover:text-brand-700"
                    disabled={!canEdit || isLoading}
                  >
                    Edit
                  </button>
                </div>
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  {user?.name || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-slate-700">Phone</div>
                  <button
                    type="button"
                    onClick={openPhone}
                    className="text-sm font-bold text-brand-600 hover:text-brand-700"
                    disabled={!canEdit || isLoading}
                  >
                    Edit
                  </button>
                </div>
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  {user?.phone || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-700">Account</div>
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  {user?.role === "both" ? "Host & Guest" : user?.role === "lister" ? "Host" : "Guest"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-700">Member since</div>
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  March 2026
                </div>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">To-do</h3>
                <p className="text-sm text-slate-500">Complete your tasks for full access</p>
              </div>
              <Link
                href={settingsHref}
                className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Manage
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {setupItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.done ? "bg-brand-50 text-brand-700 border border-brand-200" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
                      <i className={`ph-bold ${item.icon} text-xl`}></i>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{item.desc}</div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    {item.done ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-200">
                        <i className="ph-fill ph-check-circle"></i>
                        Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">
                        <i className="ph-fill ph-warning-circle"></i>
                        Required
                      </span>
                    )}
                    <i className="ph ph-caret-right text-slate-400"></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">Account settings</h3>
                <p className="text-sm text-slate-500">Security, privacy, and preferences</p>
              </div>
              <Link
                href={settingsHref}
                className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                Open settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-900">{modal === "name" ? "Edit full name" : "Edit phone number"}</div>
                <div className="text-sm text-slate-500">Update your profile details.</div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {modal === "name" ? (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">Full name</div>
                  <input
                    value={fullNameDraft}
                    onChange={(e) => setFullNameDraft(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    placeholder="Your name"
                  />
                </div>
              ) : null}

              {modal === "phone" ? (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">Phone number</div>
                  <input
                    value={phoneDraft}
                    onChange={(e) => setPhoneDraft(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                    placeholder="+234..."
                  />
                </div>
              ) : null}

              {modalError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-700">
                  {modalError}
                </div>
              ) : null}
            </div>

            <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={modal === "name" ? saveName : savePhone}
                className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export default AccountProfile;
