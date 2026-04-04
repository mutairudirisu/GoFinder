"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type SettingsTab =
  | "personal"
  | "security"
  | "privacy"
  | "notifications"
  | "taxes"
  | "payments"
  | "language"
  | "hosting";

type Mode = "host" | "guest";

export function AccountSettings({ mode }: { mode: Mode }) {
  const { user, completeProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("personal");
  const [mobileTab, setMobileTab] = useState<SettingsTab | null>(null);
  const [modal, setModal] = useState<
    null | "name" | "phone" | "emailVerify" | "phoneVerify" | "idVerify" | "addCard" | "addPayout"
  >(null);
  const [fullNameDraft, setFullNameDraft] = useState("");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneVerifyStage, setPhoneVerifyStage] = useState<"PHONE" | "CODE">("PHONE");
  const [phoneCodeSentAt, setPhoneCodeSentAt] = useState<number | null>(null);
  const [cooldownTick, setCooldownTick] = useState(0);
  const [idTypeDraft, setIdTypeDraft] = useState<string>("nin");
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idSelfieFile, setIdSelfieFile] = useState<File | null>(null);
  const [cardBrandDraft, setCardBrandDraft] = useState("");
  const [cardLast4Draft, setCardLast4Draft] = useState("");
  const [bankNameDraft, setBankNameDraft] = useState("");
  const [accountNumberDraft, setAccountNumberDraft] = useState("");
  const [accountNameDraft, setAccountNameDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const isHost = mode === "host";

  const settingsTabs = useMemo(() => {
    const tabs = [
      { id: "personal" as const, label: "Personal information", icon: "ph-user" },
      { id: "security" as const, label: "Login & security", icon: "ph-shield" },
      { id: "privacy" as const, label: "Privacy", icon: "ph-hand-fist" },
      { id: "notifications" as const, label: "Notifications", icon: "ph-bell" },
      { id: "taxes" as const, label: "Taxes", icon: "ph-receipt" },
      { id: "payments" as const, label: "Payments", icon: "ph-credit-card" },
      { id: "language" as const, label: "Languages & currency", icon: "ph-globe" },
      { id: "hosting" as const, label: "Professional hosting tools", icon: "ph-briefcase" },
    ];
    return tabs;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const hostingDisabled = !isHost;

  const emailStatus = user?.verifications?.email?.status ?? "UNVERIFIED";
  const phoneStatus = user?.verifications?.phone?.status ?? "UNVERIFIED";
  const idStatus = user?.verifications?.id?.status ?? "UNVERIFIED";

  const computedBalance = useMemo(() => {
    const userId = user?.id ? String(user.id) : "";
    if (!userId) return { available: 0, pending: 0 };
    try {
      const raw = localStorage.getItem("gigs_payments");
      const parsed = raw ? JSON.parse(raw) : [];
      const items: any[] = Array.isArray(parsed) ? parsed : [];
      const mine = items.filter((p) => String(p?.hostId ?? "") === userId);
      const available = mine
        .filter((p) => String(p?.status ?? "") === "COMPLETED")
        .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);
      const pending = mine
        .filter((p) => String(p?.status ?? "") !== "COMPLETED")
        .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);
      return { available, pending };
    } catch {
      return { available: 0, pending: 0 };
    }
  }, [user?.id]);

  const phoneCooldownSeconds = 30;
  const phoneResendRemaining =
    modal === "phoneVerify" && phoneCodeSentAt
      ? Math.max(0, phoneCooldownSeconds - Math.floor((Date.now() - phoneCodeSentAt + cooldownTick * 0) / 1000))
      : 0;
  const canResendPhoneCode = phoneResendRemaining === 0;

  useEffect(() => {
    if (modal !== "phoneVerify") return;
    const interval = window.setInterval(() => setCooldownTick((t) => t + 1), 1000);
    return () => window.clearInterval(interval);
  }, [modal]);

  const closeModal = () => {
    setModal(null);
    setModalError("");
    setEmailCode("");
    setPhoneCode("");
    setPhoneVerifyStage("PHONE");
    setPhoneCodeSentAt(null);
    setIdFrontFile(null);
    setIdBackFile(null);
    setIdSelfieFile(null);
    setCardBrandDraft("");
    setCardLast4Draft("");
    setBankNameDraft("");
    setAccountNumberDraft("");
    setAccountNameDraft("");
  };

  const closeMobileTab = () => setMobileTab(null);

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

  const openEmailVerify = () => {
    setEmailCode("");
    setModalError("");
    setModal("emailVerify");
  };

  const openPhoneVerify = () => {
    setPhoneCode("");
    setPhoneDraft(user?.phone ?? "");
    setModalError("");
    const lastSent = user?.verifications?.phone?.lastSentAt;
    const lastSentMs = lastSent ? Date.parse(String(lastSent)) : NaN;
    setPhoneCodeSentAt(Number.isFinite(lastSentMs) ? lastSentMs : null);
    setPhoneVerifyStage(phoneStatus === "PENDING" ? "CODE" : "PHONE");
    setModal("phoneVerify");
  };

  const openIdVerify = () => {
    setIdTypeDraft(user?.verifications?.id?.idType ?? "nin");
    setIdFrontFile(null);
    setIdBackFile(null);
    setIdSelfieFile(null);
    setModalError("");
    setModal("idVerify");
  };

  const openAddCard = () => {
    setCardBrandDraft("");
    setCardLast4Draft("");
    setModalError("");
    setModal("addCard");
  };

  const openAddPayout = () => {
    setBankNameDraft("");
    setAccountNumberDraft("");
    setAccountNameDraft(user?.name ?? "");
    setModalError("");
    setModal("addPayout");
  };

  const mergeVerifications = (partial: any) => {
    const current = user?.verifications ?? {};
    return {
      ...current,
      ...partial,
      email: { ...(current as any).email, ...(partial as any).email },
      phone: { ...(current as any).phone, ...(partial as any).phone },
      id: { ...(current as any).id, ...(partial as any).id },
    };
  };

  const saveName = async () => {
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

  const verifyEmail = async () => {
    setSaving(true);
    setModalError("");
    try {
      if (emailCode.trim().length !== 6) {
        setModalError("Enter the 6-digit code.");
        return;
      }
      const now = new Date().toISOString();
      await completeProfile({
        verifications: mergeVerifications({ email: { status: "VERIFIED", verifiedAt: now } }),
      });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const verifyPhone = async () => {
    setSaving(true);
    setModalError("");
    try {
      const value = phoneDraft.trim();
      if (!value) {
        setModalError("Phone number is required.");
        return;
      }
      if (phoneCode.trim().length !== 6) {
        setModalError("Enter the 6-digit code.");
        return;
      }
      const now = new Date().toISOString();
      await completeProfile({
        phone: value,
        verifications: mergeVerifications({ phone: { status: "VERIFIED", verifiedAt: now, phone: value } }),
      });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const sendPhoneCode = async () => {
    setSaving(true);
    setModalError("");
    try {
      const value = phoneDraft.trim();
      if (!value) {
        setModalError("Phone number is required.");
        return;
      }
      const now = new Date().toISOString();
      await completeProfile({
        phone: value,
        verifications: mergeVerifications({
          phone: { status: "PENDING", phone: value, requestedAt: now, lastSentAt: now },
        }),
      });
      setPhoneVerifyStage("CODE");
      setPhoneCode("");
      setPhoneCodeSentAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  const submitId = async () => {
    setSaving(true);
    setModalError("");
    try {
      if (!idFrontFile) {
        setModalError("Upload the front of your ID.");
        return;
      }
      const now = new Date().toISOString();
      await completeProfile({
        verifications: mergeVerifications({
          id: {
            status: "VERIFIED",
            verifiedAt: now,
            idType: idTypeDraft,
            files: {
              front: idFrontFile?.name,
              back: idBackFile?.name,
              selfie: idSelfieFile?.name,
            },
          },
        }),
      });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const addCard = async () => {
    setSaving(true);
    setModalError("");
    try {
      const brand = cardBrandDraft.trim();
      const last4 = cardLast4Draft.replace(/\D/g, "").slice(0, 4);
      if (!brand) {
        setModalError("Card brand is required.");
        return;
      }
      if (last4.length !== 4) {
        setModalError("Enter the last 4 digits.");
        return;
      }
      const now = new Date().toISOString();
      const existing = Array.isArray(user?.paymentMethods) ? user?.paymentMethods : [];
      await completeProfile({
        paymentMethods: [
          ...existing,
          { id: `card_${Math.random().toString(36).slice(2, 10)}`, type: "card", brand, last4, createdAt: now },
        ],
      });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const addPayout = async () => {
    setSaving(true);
    setModalError("");
    try {
      const bankName = bankNameDraft.trim();
      const accountNumber = accountNumberDraft.replace(/\D/g, "").slice(0, 10);
      const accountName = accountNameDraft.trim();
      if (!bankName) {
        setModalError("Bank name is required.");
        return;
      }
      if (accountNumber.length < 8) {
        setModalError("Enter a valid account number.");
        return;
      }
      if (!accountName) {
        setModalError("Account name is required.");
        return;
      }
      const now = new Date().toISOString();
      const existing = Array.isArray(user?.payoutMethods) ? user?.payoutMethods : [];
      await completeProfile({
        payoutMethods: [
          ...existing,
          {
            id: `payout_${Math.random().toString(36).slice(2, 10)}`,
            type: "bank",
            bankName,
            accountNumber,
            accountName,
            createdAt: now,
          },
        ],
      });
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const TabContent = ({ tab }: { tab: SettingsTab }) => (
    <>
      {tab === "personal" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Personal information</h2>
              <p className="text-slate-500 text-sm mt-1">Update your account details</p>
            </div>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Full name</h3>
                <p className="text-xs text-slate-500 mt-1">{user?.name || "Not set"}</p>
              </div>
              <button type="button" onClick={openName} className="text-sm font-bold text-brand-600 hover:text-brand-700" disabled={isLoading}>
                Edit
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Email address</h3>
                <p className="text-xs text-slate-500 mt-1">{user?.email || "Not set"}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      emailStatus === "VERIFIED" ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    <i className={`ph-fill ${emailStatus === "VERIFIED" ? "ph-seal-check" : "ph-warning-circle"}`}></i>
                    {emailStatus === "VERIFIED" ? "Verified" : "Not verified"}
                  </span>
                </div>
              </div>
              {emailStatus === "VERIFIED" ? (
                <span className="text-xs font-bold text-slate-400">Verified</span>
              ) : (
                <button type="button" onClick={openEmailVerify} className="text-sm font-bold text-brand-600 hover:text-brand-700" disabled={isLoading}>
                  Verify
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Phone number</h3>
                <p className="text-xs text-slate-500 mt-1">{user?.phone || "Not set"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      phoneStatus === "VERIFIED" ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    <i className={`ph-fill ${phoneStatus === "VERIFIED" ? "ph-seal-check" : "ph-warning-circle"}`}></i>
                    {phoneStatus === "VERIFIED" ? "Verified" : "Not verified"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={openPhone} className="text-sm font-bold text-slate-700 hover:text-brand-700" disabled={isLoading}>
                  Edit
                </button>
                {phoneStatus === "VERIFIED" ? null : (
                  <button type="button" onClick={openPhoneVerify} className="text-sm font-bold text-brand-600 hover:text-brand-700" disabled={isLoading}>
                    Verify
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Government ID</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {idStatus === "VERIFIED"
                    ? `Verified${user?.verifications?.id?.idType ? ` • ${String(user.verifications.id.idType).toUpperCase()}` : ""}`
                    : "Add an ID to unlock instant publishing"}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      idStatus === "VERIFIED"
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : idStatus === "PENDING"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    <i className={`ph-fill ${idStatus === "VERIFIED" ? "ph-seal-check" : idStatus === "PENDING" ? "ph-hourglass" : "ph-warning-circle"}`}></i>
                    {idStatus === "VERIFIED" ? "Verified" : idStatus === "PENDING" ? "Pending" : "Not verified"}
                  </span>
                </div>
              </div>
              {idStatus === "VERIFIED" ? (
                <span className="text-xs font-bold text-slate-400">Verified</span>
              ) : (
                <button type="button" onClick={openIdVerify} className="text-sm font-bold text-brand-600 hover:text-brand-700" disabled={isLoading}>
                  Upload
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Login & security</h2>
            <p className="text-slate-500 text-sm">Manage how you sign in</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Password</h3>
                <p className="text-xs text-slate-500 mt-1">Last updated 2 months ago</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Update</button>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Two-factor authentication</h3>
                <p className="text-xs text-slate-500 mt-1">Not enabled</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Enable</button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "privacy" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Privacy</h2>
            <p className="text-slate-500 text-sm">Control how your data is used</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Profile visibility</h3>
                <p className="text-xs text-slate-500 mt-1">Control who can see your profile</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Manage</button>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Data download</h3>
                <p className="text-xs text-slate-500 mt-1">Download your GIGS data</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Request</button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Notifications</h2>
            <p className="text-slate-500 text-sm">Choose what you hear about</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Email notifications</h3>
                <p className="text-xs text-slate-500 mt-1">Booking updates and important alerts</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Manage</button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "taxes" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Taxes</h2>
            <p className="text-slate-500 text-sm">Manage your tax information</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Taxpayer information</h3>
                <p className="text-xs text-slate-500 mt-1">Not provided</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Add</button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "payments" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Payments</h2>
            <p className="text-slate-500 text-sm">Manage cards and payout methods</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            {isHost ? (
              <div className="p-5 border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/70">Balance</div>
                    <div className="mt-2 text-2xl font-display font-bold">₦{computedBalance.available.toLocaleString()}</div>
                    <div className="text-sm text-white/70 mt-1">Available</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <i className="ph-bold ph-wallet text-xl"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-white/70">Pending</span>
                  <span className="font-bold">₦{computedBalance.pending.toLocaleString()}</span>
                </div>
              </div>
            ) : null}

            {isHost ? (
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Payout methods</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {Array.isArray(user?.payoutMethods) && user.payoutMethods.length > 0 ? `${user.payoutMethods.length} account(s) added` : "No payout method added"}
                  </p>
                </div>
                <button type="button" onClick={openAddPayout} className="text-sm font-bold text-brand-600 hover:text-brand-700">
                  Add
                </button>
              </div>
            ) : null}

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Payment methods</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {Array.isArray(user?.paymentMethods) && user.paymentMethods.length > 0 ? `${user.paymentMethods.length} card(s) added` : "No cards added"}
                </p>
              </div>
              <button type="button" onClick={openAddCard} className="text-sm font-bold text-brand-600 hover:text-brand-700">
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "language" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Languages & currency</h2>
            <p className="text-slate-500 text-sm">Regional preferences</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Currency</h3>
                <p className="text-xs text-slate-500 mt-1">NGN (₦)</p>
              </div>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Change</button>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "hosting" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Professional hosting tools</h2>
            <p className="text-slate-500 text-sm">{hostingDisabled ? "Switch to host to access these tools." : "Tools for managing your hosting business."}</p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            {hostingDisabled ? (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">Hosting tools are unavailable in Guest mode</div>
                <div className="text-sm text-slate-600">Switch to host to manage listings, calendars, and messages from finders.</div>
              </div>
            ) : (
              <>
                <Link href="/hosting/listings" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Listings</h3>
                    <p className="text-xs text-slate-500 mt-1">Create and manage properties</p>
                  </div>
                  <i className="ph ph-caret-right text-slate-400"></i>
                </Link>
                <Link href="/hosting/calendar" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Calendar</h3>
                    <p className="text-xs text-slate-500 mt-1">Availability and bookings</p>
                  </div>
                  <i className="ph ph-caret-right text-slate-400"></i>
                </Link>
                <Link href="/hosting/bookings" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Bookings</h3>
                    <p className="text-xs text-slate-500 mt-1">Incoming booking requests</p>
                  </div>
                  <i className="ph ph-caret-right text-slate-400"></i>
                </Link>
                <Link href="/hosting/messages" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Messages</h3>
                    <p className="text-xs text-slate-500 mt-1">Chats from finders</p>
                  </div>
                  <i className="ph ph-caret-right text-slate-400"></i>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-6xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">Account settings</h1>
          <p className="text-slate-500">Manage your account information and preferences</p>
        </div>
        {hostingDisabled ? (
          <Link
            href="/hosting"
            onClick={() => {
              try {
                localStorage.setItem("gigs_current_mode", "host");
              } catch {
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
          >
            <i className="ph-bold ph-storefront"></i>
            Switch to host
          </Link>
        ) : null}
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="md:hidden space-y-3">
          {emailStatus !== "VERIFIED" ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <i className="ph-bold ph-envelope"></i>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Confirm your email address</div>
                  <div className="text-xs text-slate-500 mt-1">We’ll send a code to your inbox.</div>
                </div>
              </div>
              <button type="button" onClick={openEmailVerify} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800">
                Confirm
              </button>
            </div>
          ) : null}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {settingsTabs.map((tab) => {
              const isDisabled = tab.id === "hosting" && hostingDisabled;
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setActiveTab(tab.id);
                    setMobileTab(tab.id);
                    closeModal();
                  }}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-5 border-b border-slate-100 transition-colors ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-50/60"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <i className={`ph-bold ${tab.icon}`}></i>
                    </span>
                    <span className="font-bold text-slate-900">{tab.label}</span>
                  </span>
                  <i className="ph ph-caret-right text-slate-400"></i>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1 md:sticky md:top-20">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDisabled = tab.id === "hosting" && hostingDisabled;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (isDisabled) return;
                    setActiveTab(tab.id);
                    closeModal();
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-600" : ""}`}
                >
                  <i className={`ph-bold ${tab.icon} text-lg`}></i>
                  <span className="font-semibold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hidden md:block flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
            <TabContent tab={activeTab} />
          </div>
        </motion.div>
      </div>

      {mobileTab ? (
        <div className="fixed inset-0 z-[70] bg-white md:hidden">
          <div className="h-16 border-b border-slate-200 flex items-center gap-3 px-4">
            <button type="button" onClick={closeMobileTab} className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <i className="ph-bold ph-caret-left"></i>
            </button>
            <div className="font-display font-bold text-slate-900">
              {settingsTabs.find((t) => t.id === mobileTab)?.label ?? "Account settings"}
            </div>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <TabContent tab={mobileTab} />
            </div>
          </div>
        </div>
      ) : null}

      {modal ? (
        <div className="fixed inset-0 z-[80] flex flex-col md:items-center md:justify-center md:p-4 bg-white md:bg-black/40">
          <div className="w-full h-full md:h-auto md:max-w-lg bg-white flex flex-col md:rounded-[32px] md:border md:border-slate-200 md:shadow-2xl overflow-hidden">
            <div className="p-4 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-900">
                  {modal === "name"
                    ? "Edit full name"
                    : modal === "phone"
                      ? "Edit phone number"
                      : modal === "emailVerify"
                        ? "Verify email"
                        : modal === "phoneVerify"
                          ? "Verify phone number"
                          : modal === "addCard"
                            ? "Add card"
                            : modal === "addPayout"
                              ? "Add payout method"
                              : "Upload government ID"}
                </div>
                <div className="text-sm text-slate-500">
                  {modal === "emailVerify"
                    ? "Enter the 6-digit code sent to your email."
                    : modal === "phoneVerify"
                      ? "Enter the 6-digit code sent to your phone."
                      : modal === "addCard"
                        ? "Add a card for making payments on the platform."
                        : modal === "addPayout"
                          ? "Add a bank account to receive payouts."
                      : modal === "idVerify"
                        ? "Choose an ID type and upload clear photos."
                        : "Update your profile details."}
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph-bold ph-caret-left text-xl md:hidden"></i>
                <i className="ph ph-x text-xl hidden md:block"></i>
              </button>
            </div>

            <div className="p-4 md:p-8 space-y-5 overflow-y-auto md:overflow-visible flex-1">
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

              {modal === "emailVerify" ? (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-700">6-digit code</div>
                  <input
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 tracking-[0.25em]"
                    placeholder="______"
                    inputMode="numeric"
                  />
                  <div className="text-xs text-slate-500">Demo: enter any 6 digits.</div>
                </div>
              ) : null}

              {modal === "phoneVerify" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Phone number</div>
                    <input
                      value={phoneDraft}
                      onChange={(e) => setPhoneDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      placeholder="+234..."
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={sendPhoneCode}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={saving || !canResendPhoneCode}
                      >
                        {phoneVerifyStage === "CODE" ? "Resend code" : "Send code"}
                      </button>
                      {!canResendPhoneCode ? (
                        <div className="text-sm text-slate-500">Resend in {phoneResendRemaining}s</div>
                      ) : (
                        <div className="text-sm text-slate-500">Demo: code is not actually sent.</div>
                      )}
                    </div>
                  </div>
                  {phoneVerifyStage === "CODE" ? (
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-slate-700">6-digit code</div>
                      <input
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 tracking-[0.25em]"
                        placeholder="______"
                        inputMode="numeric"
                      />
                      <div className="text-xs text-slate-500">Demo: enter any 6 digits.</div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      Send a code to continue.
                    </div>
                  )}
                </div>
              ) : null}

              {modal === "addCard" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Card brand</div>
                    <input
                      value={cardBrandDraft}
                      onChange={(e) => setCardBrandDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      placeholder="Visa / Mastercard"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Last 4 digits</div>
                    <input
                      value={cardLast4Draft}
                      onChange={(e) => setCardLast4Draft(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 tracking-[0.25em]"
                      placeholder="____"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              ) : null}

              {modal === "addPayout" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Bank name</div>
                    <input
                      value={bankNameDraft}
                      onChange={(e) => setBankNameDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      placeholder="e.g. GTBank"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Account number</div>
                    <input
                      value={accountNumberDraft}
                      onChange={(e) => setAccountNumberDraft(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 tracking-[0.15em]"
                      placeholder="__________"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Account name</div>
                    <input
                      value={accountNameDraft}
                      onChange={(e) => setAccountNameDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
                      placeholder="Your name"
                    />
                  </div>
                </div>
              ) : null}

              {modal === "idVerify" ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">ID type</div>
                    <select
                      value={idTypeDraft}
                      onChange={(e) => setIdTypeDraft(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900 bg-white"
                    >
                      <option value="nin">National ID (NIN)</option>
                      <option value="passport">International Passport</option>
                      <option value="drivers_license">Driver’s license</option>
                      <option value="voters_card">Voter’s card</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Front</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdFrontFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm"
                      />
                      <div className="text-xs text-slate-500 mt-2 line-clamp-1">{idFrontFile?.name || "No file selected"}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Back (optional)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdBackFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm"
                      />
                      <div className="text-xs text-slate-500 mt-2 line-clamp-1">{idBackFile?.name || "No file selected"}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Selfie (optional)</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdSelfieFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm"
                      />
                      <div className="text-xs text-slate-500 mt-2 line-clamp-1">{idSelfieFile?.name || "No file selected"}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                    We store only the file names for now (testing mode). In production this will upload securely.
                  </div>
                </div>
              ) : null}

              {modalError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-700">
                  {modalError}
                </div>
              ) : null}
            </div>

            <div className="p-4 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3">
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
                onClick={
                  modal === "name"
                    ? saveName
                    : modal === "phone"
                      ? savePhone
                      : modal === "emailVerify"
                        ? verifyEmail
                        : modal === "phoneVerify"
                          ? verifyPhone
                          : modal === "addCard"
                            ? addCard
                            : modal === "addPayout"
                              ? addPayout
                              : submitId
                }
                className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving || (modal === "phoneVerify" && phoneVerifyStage !== "CODE")}
              >
                {saving
                  ? "Saving..."
                  : modal === "emailVerify" || modal === "phoneVerify"
                    ? "Verify"
                    : modal === "idVerify"
                      ? "Submit"
                      : modal === "addCard" || modal === "addPayout"
                        ? "Add"
                        : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export default AccountSettings;
