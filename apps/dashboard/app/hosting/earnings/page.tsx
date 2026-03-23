"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HostingEarningsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock earnings data
  const stats = {
    totalEarnings: 12450,
    pendingPayout: 1250,
    completedPayouts: 11200,
    thisMonth: 3450,
    thisMonthChange: 15.3,
    bookingsThisMonth: 23,
  };

  const earningsByMonth = [
    { month: 'Oct', earnings: 2800 },
    { month: 'Nov', earnings: 3200 },
    { month: 'Dec', earnings: 2100 },
    { month: 'Jan', earnings: 1500 },
    { month: 'Feb', earnings: 2900 },
    { month: 'Mar', earnings: 3450 },
  ];

  const maxEarnings = Math.max(...earningsByMonth.map(e => e.earnings));

  const recentTransactions = [
    { id: 1, guest: 'Sarah Johnson', listing: 'Modern Downtown Apartment', date: 'Mar 15, 2026', amount: 450, status: 'completed' },
    { id: 2, guest: 'Michael Chen', listing: 'Cozy Studio near Campus', date: 'Mar 12, 2026', amount: 320, status: 'completed' },
    { id: 3, guest: 'Emily Davis', listing: 'Spacious 2-Bedroom Flat', date: 'Mar 10, 2026', amount: 680, status: 'completed' },
    { id: 4, guest: 'James Wilson', listing: 'Modern Downtown Apartment', date: 'Mar 8, 2026', amount: 450, status: 'pending' },
    { id: 5, guest: 'Lisa Anderson', listing: 'Modern Downtown Apartment', date: 'Mar 5, 2026', amount: 550, status: 'completed' },
  ];

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">Earnings</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Track your income and payouts</p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-brand-600 transition-colors whitespace-nowrap">
          <i className="ph-bold ph-download"></i>
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Total Earnings */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Total Earnings</p>
          <span className="text-2xl sm:text-3xl font-bold text-slate-800">${stats.totalEarnings.toLocaleString()}</span>
          <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center gap-1">
            <i className="ph-bold ph-trend-up"></i>
            All time
          </p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">This Month</p>
          <span className="text-2xl sm:text-3xl font-bold text-slate-800">${stats.thisMonth.toLocaleString()}</span>
          <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center gap-1">
            <i className="ph-bold ph-trend-up"></i>
            +{stats.thisMonthChange}%
          </p>
        </div>

        {/* Pending Payout */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Pending Payout</p>
          <span className="text-2xl sm:text-3xl font-bold text-slate-800">${stats.pendingPayout.toLocaleString()}</span>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Processing...</p>
        </div>

        {/* Completed Payouts */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Completed Payouts</p>
          <span className="text-2xl sm:text-3xl font-bold text-slate-800">${stats.completedPayouts.toLocaleString()}</span>
          <p className="text-xs sm:text-sm text-green-600 mt-1">5 transactions</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="font-display font-bold text-lg sm:text-lg text-slate-800">Earnings Overview</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                timeRange === 'week' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                timeRange === 'month' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                timeRange === 'year' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-40 sm:h-48 lg:h-64 overflow-x-auto">
          {earningsByMonth.map((month) => (
            <div key={month.month} className="flex-1 flex flex-col items-center min-w-0">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">${month.earnings.toLocaleString()}</span>
                <div 
                  className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                  style={{ height: `${(month.earnings / maxEarnings) * (window.innerWidth < 640 ? 120 : 180)}px` }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3">{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h3 className="font-display font-bold text-lg sm:text-lg text-slate-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-500">Guest</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-500">Listing</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-500">Date</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-500">Amount</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 sm:w-8 h-7 sm:h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-semibold text-xs sm:text-sm flex-shrink-0">
                        {transaction.guest.charAt(0)}
                      </div>
                      <span className="font-medium text-xs sm:text-sm text-slate-700 truncate">{transaction.guest}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 truncate">{transaction.listing}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-500 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">${transaction.amount}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
