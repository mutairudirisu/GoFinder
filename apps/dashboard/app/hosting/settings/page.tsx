"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HostingSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'payment' | 'security'>('general');
  const [saving, setSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    responseTime: 'within_an_hour',
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    newMessage: true,
    reviewReceived: true,
    payoutProcessed: true,
    weeklyReport: false,
  });

  const [payment, setPayment] = useState({
    bankName: 'Chase Bank',
    accountNumber: '****4521',
    routingNumber: '****7890',
    payoutSchedule: 'weekly',
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Profile updated successfully!');
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-4 lg:px-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm sm:text-base mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 sm:px-4 lg:px-6">
        {/* Tabs - Responsive */}
        <div className="w-full md:w-64 md:flex-shrink-0">
          <nav className="flex md:flex-col gap-2 md:space-y-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal ${
                activeTab === 'general'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="ph-bold ph-user text-lg md:text-xl flex-shrink-0"></i>
              <span className="font-medium text-xs md:text-sm">General</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal ${
                activeTab === 'notifications'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="ph-bold ph-bell text-lg md:text-xl flex-shrink-0"></i>
              <span className="font-medium text-xs md:text-sm">Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal ${
                activeTab === 'payment'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="ph-bold ph-credit-card text-lg md:text-xl flex-shrink-0"></i>
              <span className="font-medium text-xs md:text-sm">Payment</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-left transition-colors whitespace-nowrap md:whitespace-normal ${
                activeTab === 'security'
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className="ph-bold ph-shield-check text-lg md:text-xl flex-shrink-0"></i>
              <span className="font-medium text-xs md:text-sm">Security</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg md:rounded-2xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-slate-800 mb-4 md:mb-6">Profile Settings</h3>
              
              <div className="space-y-4 md:space-y-6">
                {/* Profile Photo */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Profile Photo</label>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-brand-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap">
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                {/* Response Time */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Response Time</label>
                  <select
                    value={profile.responseTime}
                    onChange={(e) => setProfile({ ...profile, responseTime: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  >
                    <option value="within_an_hour">Within an hour</option>
                    <option value="within_a_few_hours">Within a few hours</option>
                    <option value="within_a_day">Within a day</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg md:rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg md:rounded-2xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-slate-800 mb-4 md:mb-6">Notification Preferences</h3>
              
              <div className="space-y-3 md:space-y-4">
                {[
                  { key: 'newBooking', label: 'New Booking', desc: 'Get notified when someone books your listing' },
                  { key: 'newMessage', label: 'New Message', desc: 'Get notified when you receive a message' },
                  { key: 'reviewReceived', label: 'New Review', desc: 'Get notified when a guest leaves a review' },
                  { key: 'payoutProcessed', label: 'Payout Processed', desc: 'Get notified when your payout is processed' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary of your earnings' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-3 md:gap-4 p-3 md:p-4 border border-slate-200 rounded-lg md:rounded-xl">
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-slate-700">{item.label}</p>
                      <p className="text-xs md:text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`w-12 md:w-14 h-6 md:h-7 rounded-full transition-colors flex-shrink-0 ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow transform transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6 md:translate-x-7' : 'translate-x-0.5 md:translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-lg md:rounded-2xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-slate-800 mb-4 md:mb-6">Payment Settings</h3>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Bank Name</label>
                  <input
                    type="text"
                    value={payment.bankName}
                    onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Account Number</label>
                  <input
                    type="text"
                    value={payment.accountNumber}
                    onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Routing Number</label>
                  <input
                    type="text"
                    value={payment.routingNumber}
                    onChange={(e) => setPayment({ ...payment, routingNumber: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">Payout Schedule</label>
                  <select
                    value={payment.payoutSchedule}
                    onChange={(e) => setPayment({ ...payment, payoutSchedule: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-slate-200 rounded-lg md:rounded-xl focus:border-brand-300 focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <button className="px-4 md:px-6 py-2 md:py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg md:rounded-xl hover:bg-brand-600 transition-colors w-full md:w-auto">
                  Update Payment Info
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg md:rounded-2xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-slate-800 mb-4 md:mb-6">Security Settings</h3>
              
              <div className="space-y-4 md:space-y-6">
                <div className="p-3 md:p-4 border border-slate-200 rounded-lg md:rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-slate-700">Password</p>
                      <p className="text-xs md:text-sm text-slate-500">Last changed 30 days ago</p>
                    </div>
                    <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap">
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-3 md:p-4 border border-slate-200 rounded-lg md:rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-slate-700">Two-Factor Authentication</p>
                      <p className="text-xs md:text-sm text-slate-500">Add an extra layer of security</p>
                    </div>
                    <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="p-3 md:p-4 border border-red-200 rounded-lg md:rounded-xl bg-red-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base text-red-700">Delete Account</p>
                      <p className="text-xs md:text-sm text-red-500">Permanently delete your account and data</p>
                    </div>
                    <button className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
