"use client";

export default function AdminLocationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-3xl font-display font-bold text-slate-900">Locations</div>
      <div className="text-sm text-slate-500 mt-1">Location & category control.</div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="ph-bold ph-map-pin text-2xl text-slate-600"></i>
        </div>
        <div className="text-lg font-bold text-slate-900">Coming soon</div>
        <div className="text-sm text-slate-500 mt-1">Create locations, areas, and homepage sections.</div>
      </div>
    </div>
  );
}

