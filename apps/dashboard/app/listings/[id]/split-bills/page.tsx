"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { mockProperties } from "../../data";
import { Header } from "@/components/layout";

export default function SplitBillsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const property = mockProperties.find(p => p.id === unwrappedParams.id);

  const [roommateCount, setRoommateCount] = useState(property?.roommatesNeeded || 2);
  const [billSplit, setBillSplit] = useState({
    rent: property?.price || 350,
    electricity: 50,
    water: 30,
    internet: 25,
    cleaning: 20,
    security: 15,
    maintenance: 10
  });

  const [customBills, setCustomBills] = useState<{name: string, amount: number}[]>([]);
  const [newBillName, setNewBillName] = useState("");

  // Redirect if property doesn't need roommates
  if (property && !property.needsRoommates) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50/30 pb-20 lg:pb-0">
        {/* Header - hidden on mobile */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile Header */}
        <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
          <Link href={`/listings/${property.id}`} className="flex items-center gap-2">
            <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
          </Link>
          <span className="ml-3 font-display font-bold text-brand-dark">Split Bills</span>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 mx-auto">
              <i className="ph-bold ph-credit-card text-green-600 text-4xl"></i>
            </div>
            <h1 className="font-display font-bold text-2xl text-brand-dark mb-2">
              This is a Regular Listing
            </h1>
            <p className="text-slate-500 mb-6">
              Bill splitting is only available for properties that need roommates.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/listings/${property.id}`}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Back to Property
              </Link>
              <Link
                href="/listings"
                className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30 pb-20 lg:pb-0">
        {/* Header - hidden on mobile */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile Header */}
        <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
          <Link href="/listings" className="flex items-center gap-2">
            <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
          </Link>
          <span className="ml-3 font-display font-bold text-brand-dark">Not Found</span>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <h1 className="font-display font-bold text-2xl text-brand-dark mb-4">
              Property Not Found
            </h1>
            <Link href="/listings" className="text-brand-600 hover:text-brand-700 font-medium">
              ← Back to Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const addCustomBill = () => {
    if (newBillName.trim() && customBills.length < 5) {
      setCustomBills([...customBills, { name: newBillName, amount: 0 }]);
      setNewBillName("");
    }
  };

  const removeCustomBill = (index: number) => {
    setCustomBills(customBills.filter((_, i) => i !== index));
  };

  const updateCustomBillAmount = (index: number, amount: number) => {
    const updated = [...customBills];
    if (updated[index]) {
      updated[index].amount = amount;
    }
    setCustomBills(updated);
  };

  const totalMonthly = Object.values(billSplit).reduce((a, b) => a + b, 0) + 
    customBills.reduce((a, b) => a + b.amount, 0);
  const perPerson = (totalMonthly / roommateCount).toFixed(2);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 pb-20 lg:pb-0">
      {/* Header - hidden on mobile */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
        <Link href={`/listings/${property.id}`} className="flex items-center gap-2">
          <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
        </Link>
        <span className="ml-3 font-display font-bold text-brand-dark">Split Bills</span>
      </div>

      {/* Navigation - hidden on mobile */}
      <div className="bg-white border-b border-slate-100 pt-14 sm:pt-16 hidden lg:block">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href={`/listings/${property.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
          >
            <i className="ph-bold ph-arrow-left"></i>
            Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <i className="ph-bold ph-receipt text-blue-600 text-4xl"></i>
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-dark mb-2">
              Split Bills
            </h1>
            <p className="text-slate-500">
              Calculate and split bills for {property.title}
            </p>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-8">
            <div className="flex gap-4">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-24 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-brand-dark text-lg">{property.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <i className="ph-bold ph-map-pin"></i>
                  {property.location}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bill Inputs */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
              <h3 className="font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
                <i className="ph-bold ph-list-dashes"></i>
                Monthly Bills
              </h3>

              <div className="space-y-4">
                {/* Rent */}
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-green-800 flex items-center gap-2">
                      <i className="ph-bold ph-house-line text-green-600"></i>
                      Rent
                    </label>
                    <span className="text-green-700 font-bold">₦{billSplit.rent}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={billSplit.rent}
                    onChange={(e) => setBillSplit({...billSplit, rent: Number(e.target.value)})}
                    className="w-full accent-green-500"
                  />
                </div>

                {/* Electricity */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-lightning text-amber-500"></i>
                    Electricity
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.electricity}
                      onChange={(e) => setBillSplit({...billSplit, electricity: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Water */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-drop text-blue-500"></i>
                    Water
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.water}
                      onChange={(e) => setBillSplit({...billSplit, water: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Internet */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-wifi-high text-purple-500"></i>
                    Internet
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.internet}
                      onChange={(e) => setBillSplit({...billSplit, internet: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cleaning */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-broom text-orange-500"></i>
                    Cleaning
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.cleaning}
                      onChange={(e) => setBillSplit({...billSplit, cleaning: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Security */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-shield-check text-green-500"></i>
                    Security
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.security}
                      onChange={(e) => setBillSplit({...billSplit, security: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Maintenance */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <label className="text-slate-700 flex items-center gap-2">
                    <i className="ph-bold ph-wrench text-gray-500"></i>
                    Maintenance
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₦</span>
                    <input
                      type="number"
                      value={billSplit.maintenance}
                      onChange={(e) => setBillSplit({...billSplit, maintenance: Number(e.target.value)})}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Custom Bills */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Add Custom Bill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBillName}
                      onChange={(e) => setNewBillName(e.target.value)}
                      placeholder="Bill name"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-300 focus:outline-none"
                    />
                    <button
                      onClick={addCustomBill}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>

                  {customBills.map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-2">
                      <span className="text-slate-700">{bill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">₦</span>
                        <input
                          type="number"
                          value={bill.amount}
                          onChange={(e) => updateCustomBillAmount(index, Number(e.target.value))}
                          className="w-20 px-2 py-1 text-right rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => removeCustomBill(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <i className="ph-bold ph-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Roommate Count */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <h3 className="font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
                  <i className="ph-bold ph-users-three text-amber-500"></i>
                  Number of Roommates
                </h3>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setRoommateCount(Math.max(1, roommateCount - 1))}
                    className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <i className="ph-bold ph-minus text-xl"></i>
                  </button>
                  <span className="text-4xl font-bold text-brand-dark">{roommateCount}</span>
                  <button
                    onClick={() => setRoommateCount(Math.min(10, roommateCount + 1))}
                    className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <i className="ph-bold ph-plus text-xl"></i>
                  </button>
                </div>
                <p className="text-center text-slate-500 text-sm mt-2">
                  {roommateCount} {roommateCount === 1 ? 'person' : 'people'} sharing
                </p>
              </div>

              {/* Total & Split */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
                <div className="text-center mb-6">
                  <p className="text-blue-100 mb-2">Total Monthly Expenses</p>
                  <p className="text-5xl font-bold">₦{totalMonthly.toLocaleString()}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100">Per Person Pays:</span>
                    <span className="text-3xl font-bold">₦{perPerson}</span>
                  </div>
                  <p className="text-blue-100 text-sm">× {roommateCount} roommates = ₦{totalMonthly.toLocaleString()}</p>
                </div>

                {/* Breakdown */}
                <div className="mt-6 space-y-2">
                  {Object.entries(billSplit).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-blue-100 capitalize">{key}</span>
                      <span className="font-semibold">₦{value}</span>
                    </div>
                  ))}
                  {customBills.map((bill, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-blue-100">{bill.name}</span>
                      <span className="font-semibold">₦{bill.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <i className="ph-bold ph-share-network"></i>
                  Share Split
                </button>
                <button className="py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <i className="ph-bold ph-download-simple"></i>
                  Download
                </button>
              </div>

              {/* Set Up Recurring */}
              <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3">
                <i className="ph-bold ph-calendar-check text-amber-600 text-2xl"></i>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800">Set Up Recurring Payments</p>
                  <p className="text-sm text-amber-700">Get reminded when bills are due</p>
                </div>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                  Set Up
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed lg:hidden bottom-4 left-4 right-4 z-40">
        <div className="flex items-center justify-around h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/40">
          <Link
            href={`/listings/${property.id}`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
          >
            <i className="ph-bold ph-house text-xl"></i>
            <span className="text-xs font-medium">Property</span>
          </Link>
          <Link
            href={`/listings/${property.id}/message`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <i className="ph-bold ph-chat-circle-dots text-xl"></i>
            <span className="text-xs font-medium">Message</span>
          </Link>
          <Link
            href={`/listings/${property.id}/contact`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <i className="ph-bold ph-phone text-xl"></i>
            <span className="text-xs font-medium">Contact</span>
          </Link>
          <Link
            href="/listings/saved"
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-red-500 transition-colors"
          >
            <i className="ph-bold ph-heart text-xl"></i>
            <span className="text-xs font-medium">Saved</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
