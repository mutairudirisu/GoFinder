"use client";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-3xl font-display font-bold text-slate-900">Settings</div>
      <div className="text-sm text-slate-500 mt-1">System settings and platform rules.</div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="ph-bold ph-gear text-2xl text-slate-600"></i>
        </div>
        <div className="text-lg font-bold text-slate-900">Coming soon</div>
        <div className="text-sm text-slate-500 mt-1">Listing rules, pricing tiers, and notifications.</div>
      </div>
    </div>
  );
}

