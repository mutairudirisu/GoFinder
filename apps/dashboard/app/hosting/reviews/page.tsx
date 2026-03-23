"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  guestName: string;
  guestAvatar: string;
  listingTitle: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export default function HostingReviewsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  // Mock reviews data
  useEffect(() => {
    setReviews([
      {
        id: '1',
        guestName: 'Sarah Johnson',
        guestAvatar: 'S',
        listingTitle: 'Modern Downtown Apartment',
        rating: 5,
        comment: 'Amazing place! The apartment was spotless and exactly as described. The location was perfect for exploring the city. Would definitely stay here again!',
        date: 'Mar 15, 2026',
        response: 'Thank you so much for the kind words, Sarah! It was our pleasure to host you. We hope to welcome you back soon!'
      },
      {
        id: '2',
        guestName: 'Michael Chen',
        guestAvatar: 'M',
        listingTitle: 'Cozy Studio near Campus',
        rating: 4,
        comment: 'Great location and very clean. The studio had everything I needed. Only minor issue was the WiFi was a bit slow, but otherwise a wonderful stay.',
        date: 'Mar 12, 2026'
      },
      {
        id: '3',
        guestName: 'Emily Davis',
        guestAvatar: 'E',
        listingTitle: 'Spacious 2-Bedroom Flat',
        rating: 5,
        comment: 'Exceeded expectations! The place was spacious, beautifully decorated, and the host was incredibly responsive. Perfect for our family trip.',
        date: 'Mar 10, 2026'
      },
      {
        id: '4',
        guestName: 'James Wilson',
        guestAvatar: 'J',
        listingTitle: 'Modern Downtown Apartment',
        rating: 3,
        comment: 'Decent stay. The apartment was okay but could use some updates. Location was good though.',
        date: 'Mar 8, 2026',
        response: 'Thank you for your feedback, James. We appreciate your honest review and are working on improvements.'
      },
      {
        id: '5',
        guestName: 'Lisa Anderson',
        guestAvatar: 'L',
        listingTitle: 'Modern Downtown Apartment',
        rating: 2,
        comment: 'Unfortunately, the place was not as clean as expected. There were some maintenance issues that were not addressed during our stay.',
        date: 'Mar 5, 2026'
      },
    ]);
  }, []);

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'positive') return review.rating >= 4;
    if (filter === 'negative') return review.rating < 4;
    return true;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating === 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-slate-800">Reviews</h2>
        <p className="text-slate-500 mt-1">See what guests are saying about your listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Overall Rating */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Overall Rating</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-800">{averageRating}</span>
            <div className="flex items-center gap-1 mb-1">
              <i className="ph ph-star-fill text-yellow-500"></i>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">{reviews.length} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 col-span-2">
          <p className="text-sm text-slate-500 mb-3">Rating Breakdown</p>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-600 w-8">{stars} star</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-400 w-8">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Response Rate</p>
          <span className="text-4xl font-bold text-slate-800">100%</span>
          <p className="text-sm text-slate-400 mt-1">All reviews responded</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-brand-500 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => setFilter('positive')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === 'positive' 
              ? 'bg-brand-500 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Positive (4-5)
        </button>
        <button
          onClick={() => setFilter('negative')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === 'negative' 
              ? 'bg-brand-500 text-white' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Needs Attention (1-3)
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              {/* Guest Avatar */}
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                {review.guestAvatar}
              </div>

              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">{review.guestName}</h3>
                    <p className="text-sm text-slate-500">{review.listingTitle}</p>
                  </div>
                  <span className="text-sm text-slate-400">{review.date}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i 
                      key={star} 
                      className={`ph-fill ${star <= review.rating ? 'text-yellow-500' : 'text-slate-200'}`}
                    ></i>
                  ))}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                    {review.rating === 5 ? 'Excellent' : review.rating === 4 ? 'Great' : review.rating === 3 ? 'Average' : 'Poor'}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-600 mb-3">{review.comment}</p>

                {/* Host Response */}
                {review.response && (
                  <div className="bg-slate-50 rounded-xl p-4 mt-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Your Response</p>
                    <p className="text-sm text-slate-600">{review.response}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
