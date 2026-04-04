"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Plus, Send, Eye, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { FileUpload } from "@repo/ui/file-upload";
import { useToast } from "@repo/ui/toast";

type RecipientType = "all_users" | "landlords" | "renters";

type NewsletterStatus = "Sent" | "Draft" | "Scheduled";

type Newsletter = {
  id: string;
  subject: string;
  preview: string;
  recipients: number;
  status: NewsletterStatus;
  sentDate: string | null;
};

const initialNewsletters: Newsletter[] = [
  {
    id: "1",
    subject: "New student housing options now available",
    preview: "Explore newly listed rooms and shared apartments near campus with flexible move-in dates...",
    recipients: 1540,
    status: "Sent",
    sentDate: "2026-02-01",
  },
  {
    id: "2",
    subject: "April move-in savings for tenants",
    preview: "Secure your rental early and get special pricing on select listings in popular neighborhoods...",
    recipients: 980,
    status: "Draft",
    sentDate: null,
  },
  {
    id: "3",
    subject: "Roommate safety tips for a better stay",
    preview: "Share this checklist with your tenants and renters to keep the house safe and comfortable...",
    recipients: 1240,
    status: "Scheduled",
    sentDate: "2026-02-10",
  },
];

const getStatusColor = (status: NewsletterStatus) => {
  switch (status) {
    case "Sent":
      return "bg-green/10 text-green";
    case "Draft":
      return "bg-neutral-light text-neutral-muted";
    case "Scheduled":
      return "bg-secondary/10 text-secondary";
    default:
      return "bg-neutral-light text-neutral-dark";
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AdminNewslettersPage() {
  const { success, error: toastError } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [formData, setFormData] = useState({
    subject: "",
    type: "all_users" as RecipientType,
    content: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);

  const filteredNewsletters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return newsletters;
    return newsletters.filter((newsletter) => {
      return (
        newsletter.subject.toLowerCase().includes(query) ||
        newsletter.preview.toLowerCase().includes(query) ||
        newsletter.status.toLowerCase().includes(query)
      );
    });
  }, [newsletters, searchQuery]);

  const handleCreateNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (attachment) {
        await wait(700);
      }

      await wait(700);

      const newNewsletter: Newsletter = {
        id: String(Date.now()),
        subject: formData.subject,
        preview: formData.content.slice(0, 80) + (formData.content.length > 80 ? "..." : ""),
        recipients:
          formData.type === "all_users"
            ? 1540
            : formData.type === "landlords"
            ? 620
            : 920,
        status: "Sent",
        sentDate: new Date().toISOString().slice(0, 10),
      };

      setNewsletters((current) => [newNewsletter, ...current]);
      success("Newsletter sent successfully!");
      setIsCreating(false);
      setFormData({ subject: "", type: "all_users", content: "" });
      setAttachment(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send newsletter";
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {isCreating ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-600 hover:bg-slate-50 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create Announcement</h1>
              <p className="text-sm text-slate-500 mt-1">Compose and send a new housing update to renters or landlords.</p>
            </div>
          </div>

          <form onSubmit={handleCreateNewsletter} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-800">Recipient Group</label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as RecipientType }))}
                  options={[
                    { value: "all_users", label: "All Users" },
                    { value: "landlords", label: "Landlords" },
                    { value: "renters", label: "Renters" },
                  ]}
                  placeholder="Select recipient group"
                  required
                />
              </div>

              <Input
                label="Subject Line"
                  placeholder="e.g. April move-in savings"
                required
              />

              <Textarea
                label="Message Content (HTML allowed)"
                placeholder="Write your update here..."
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                rows={8}
                required
              />

              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-800">Attachment (Optional)</label>
                <FileUpload
                  label=""
                  accept="*"
                  value={attachment}
                  onChange={(file) => setAttachment(file as File | null)}
                  helperText="Drag and drop a file or click to upload."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
              <p className="text-sm text-slate-500 mt-1">Create and manage rental updates for tenants and landlords.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              Create Newsletter
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search newsletters..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50 transition"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNewsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold text-slate-900">{newsletter.subject}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(newsletter.status)}`}>
                        {newsletter.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{newsletter.preview}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>Recipients: {newsletter.recipients.toLocaleString()}</span>
                      {newsletter.sentDate && (
                        <span>{newsletter.status === "Sent" ? "Sent" : "Scheduled"}: {newsletter.sentDate}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {newsletter.status === "Draft" && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-slate-800 transition"
                      >
                        <Send size={16} />
                        Send Now
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm hover:bg-slate-50 transition"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
