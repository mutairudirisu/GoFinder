"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { mockProperties } from "../data";
import { Header } from "@/components/layout";
import { ListingDetailActions } from "@/components/listings";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const property = mockProperties.find(p => p.id === unwrappedParams.id);
  const router = useRouter();
  const { user } = useAuth();
  const { startConversation } = useMessages();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [savedCount, setSavedCount] = useState(0);

  // Load favorite state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        setIsFavorite(likedIds.includes(unwrappedParams.id));
        setSavedCount(likedIds.length);
      }
    }
  }, [unwrappedParams.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    if (typeof window !== 'undefined') {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      let likedIds: string[] = savedLikes ? JSON.parse(savedLikes) : [];
      
      if (likedIds.includes(unwrappedParams.id)) {
        likedIds = likedIds.filter(id => id !== unwrappedParams.id);
        setIsFavorite(false);
      } else {
        likedIds.push(unwrappedParams.id);
        setIsFavorite(true);
      }
      
      localStorage.setItem('gigs_liked_properties', JSON.stringify(likedIds));
      window.dispatchEvent(new Event('likesUpdated'));
    }
  };

  if (!property) {
    return (
      <main className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-brand-dark mb-4">
            Property Not Found
          </h1>
          <Link 
            href="/listings" 
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to Listings
          </Link>
        </div>
      </main>
    );
  }

  const formatPrice = (price: number, type: string) => {
    return type === 'month' ? `${price}` : `${price}`;
  };

  const handleContactLandlord = () => {
    if (!user) {
      // Redirect to login with redirect to messages
      router.push('/auth/login?redirect=/messages');
      return;
    }

    if (!property) return;

    // Generate a unique landlord ID based on the landlord name
    const landlordId = `landlord_${property.landlord.name.replace(/\s+/g, '_').toLowerCase()}`;
    
    // Start a conversation
    const conversationId = startConversation(
      property.id,
      property.title,
      property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400',
      landlordId,
      property.landlord.name,
      user.id,
      user.name
    );

    // Redirect to messages page
    router.push(`/messages?conversation=${conversationId}`);
  };

  const amenityIcons: Record<string, string> = {
    wifi: "ph-wifi-high",
    furnished: "ph-bed",
    kitchen: "ph-cooking-pot",
    laundry: "ph-washing-machine",
    "study-area": "ph-books",
    security: "ph-shield-check",
    ac: "ph-snowflake",
    gym: "ph-barbell",
    parking: "ph-car",
    pool: "ph-swimming-pool",
    rooftop: "ph-buildings"
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30 pb-20 lg:pb-0">
      {/* Header - hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header - simplified for mobile */}
      <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
        <Link href="/listings" className="flex items-center gap-2">
          <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
        </Link>
        <span className="ml-3 font-display font-bold text-brand-dark truncate">{property.title}</span>
      </div>

      {/* Navigation - hidden on mobile since we have mobile header */}
      <div className="bg-white border-b border-slate-100 pt-14 sm:pt-16 hidden lg:block">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <Link 
            href="/listings" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
          >
            <i className="ph-bold ph-arrow-left"></i>
            Back to Listings
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      <section className="relative pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 sm:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-36 sm:h-64 md:h-80 lg:h-[500px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={property.images[selectedImageIndex]}
                  alt={property.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
                {property.featured && (
                  <span className="px-2 sm:px-4 py-1 sm:py-2 bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg">
                    FEATURED
                  </span>
                )}
                {property.verified && (
                  <span className="px-2 sm:px-4 py-1 sm:py-2 bg-white/90 backdrop-blur-md text-brand-600 font-bold text-xs sm:text-sm rounded-full flex items-center gap-1">
                    <i className="ph-fill ph-seal-check"></i>
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 sm:w-12 h-10 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform"
              >
                <i className={`ph ${isFavorite ? 'ph-fill' : 'ph-heart'} text-white text-lg sm:text-2xl ${isFavorite ? 'text-red-500' : ''}`}></i>
              </button>
            </motion.div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {property.images.slice(1, 5).map((image, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedImageIndex(idx + 1)}
                  className={`
                    relative h-20 sm:h-32 md:h-40 lg:h-[240px] rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer
                    border-2 sm:border-3 transition-all duration-300
                    ${selectedImageIndex === idx + 1 
                      ? 'ring-2 sm:ring-4 ring-brand-500 scale-[1.02]' 
                      : 'hover:scale-[1.02] hover:ring-2 hover:ring-brand-300'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-4 sm:py-6 md:py-8 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 md:lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Title & Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className={`
                    inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider
                    ${property.type === 'hostel' ? 'bg-purple-100 text-purple-700' : ''}
                    ${property.type === 'apartment' ? 'bg-blue-100 text-blue-700' : ''}
                    ${property.type === 'house' ? 'bg-green-100 text-green-700' : ''}
                    ${property.type === 'room' ? 'bg-orange-100 text-orange-700' : ''}
                  `}>
                    <i className={`ph ph-building-${property.type === 'hostel' || property.type === 'house' ? 'house' : 'apartment'}`}></i>
                    {property.type}
                  </span>
                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-brand-50 text-brand-700 text-xs sm:text-sm font-medium rounded-lg">
                    {property.available ? 'Available Now' : 'Unavailable'}
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-dark mb-2 sm:mb-3">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm sm:text-lg">
                  <i className="ph-bold ph-map-pin flex-shrink-0"></i>
                  <span>{property.location}</span>
                </div>
              </motion.div>

              {/* Property Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-100"
              >
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  <div className="text-center">
                    <div className="w-10 sm:w-14 h-10 sm:h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <i className="ph-bold ph-bed text-lg sm:text-2xl text-brand-600"></i>
                    </div>
                    <p className="font-display font-bold text-lg sm:text-xl text-brand-dark">
                      {property.bedrooms}
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <div className="w-10 sm:w-14 h-10 sm:h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <i className="ph-bold ph-drop text-lg sm:text-2xl text-brand-600"></i>
                    </div>
                    <p className="font-display font-bold text-lg sm:text-xl text-brand-dark">
                      {property.bathrooms}
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <i className="ph-bold ph-ruler text-2xl text-brand-600"></i>
                    </div>
                    <p className="font-display font-bold text-xl text-brand-dark">
                      120m²
                    </p>
                    <p className="text-slate-500 text-sm">
                      Area
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {['overview', 'amenities', 'location', 'rules'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300
                        ${activeTab === tab 
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }
                      `}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-xl text-brand-dark mb-4">
                        About This Property
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Experience modern living in the heart of {property.location.split(',')[0]}. 
                        This {property.type === 'hostel' ? 'student hostel' : property.type} offers the perfect blend of 
                        comfort and convenience for students and young professionals. With {property.bedrooms} bedrooms 
                        and {property.bathrooms} bathrooms, this space is designed to meet all your living needs.
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        The property features high-speed WiFi, fully furnished rooms, and is located near universities 
                        and public transportation. Perfect for students looking for a comfortable and affordable place 
                        to call home during their studies.
                      </p>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-brand-dark mb-3 sm:mb-4">
                        Amenities
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {property.amenities.map((amenity) => (
                          <div 
                            key={amenity}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                          >
                            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                              <i className={`ph ${amenityIcons[amenity] || 'ph-check'} text-brand-600 text-xl`}></i>
                            </div>
                            <span className="font-medium text-slate-700 capitalize">
                              {amenity.replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-xl text-brand-dark mb-4">
                        Location
                      </h3>
                      <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
                        <div className="text-center">
                          <i className="ph-bold ph-map-trifold text-4xl text-slate-400 mb-2"></i>
                          <p className="text-slate-500">Map view coming soon</p>
                          <p className="text-sm text-slate-400">{property.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg flex items-center gap-1">
                          <i className="ph-bold ph-bus"></i>
                          Near Public Transit
                        </span>
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg flex items-center gap-1">
                          <i className="ph-bold ph-graduation-cap"></i>
                          Near University
                        </span>
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg flex items-center gap-1">
                          <i className="ph-bold ph-storefront"></i>
                          Near Shopping
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rules' && (
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-xl text-brand-dark mb-4">
                        House Rules
                      </h3>
                      <ul className="space-y-3">
                        {[
                          'No smoking in common areas',
                          'Quiet hours: 10 PM - 7 AM',
                          'Guests allowed until 9 PM',
                          'Pets are not allowed',
                          'Keep common areas clean',
                          'Respect other residents'
                        ].map((rule, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-slate-600">
                            <i className="ph-bold ph-check-circle text-brand-500 text-xl"></i>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl text-brand-dark">
                    Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <i className="ph-fill ph-star text-amber-400 text-xl"></i>
                    <span className="font-bold text-brand-dark">{property.rating}</span>
                    <span className="text-slate-500">({property.reviews} reviews)</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4">
                  {/* Sample Reviews */}
                  {[
                    { name: "Sarah M.", rating: 5, date: "2 weeks ago", comment: "Great place! Very clean and the landlord is very responsive. Would highly recommend to other students." },
                    { name: "John D.", rating: 4, date: "1 month ago", comment: "Good location and amenities. The atmosphere is friendly and inclusive." }
                  ].map((review, idx) => (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-brand-600">{review.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-brand-dark">{review.name}</p>
                            <p className="text-xs text-slate-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`ph-fill ph-star text-sm ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Actions Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-20 sm:top-24"
              >
                {/* Listing Detail Actions - Message, Contact, Roommates, Bills */}
                <ListingDetailActions property={property} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-dark mb-4 sm:mb-6">
            Similar Properties
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockProperties
              .filter(p => p.id !== property.id)
              .slice(0, 4)
              .map((prop) => (
                <Link 
                  key={prop.id}
                  href={`/listings/${prop.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl hover:border-brand-100 transition-all duration-300">
                    <div className="relative h-40">
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="font-bold text-white">{prop.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-brand-600">
                          ${prop.price}/mo
                        </span>
                        <div className="flex items-center gap-1">
                          <i className="ph-fill ph-star text-amber-400 text-sm"></i>
                          <span className="text-sm text-slate-600">{prop.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed lg:hidden bottom-4 left-4 right-4 z-40">
        <div className="flex items-center justify-around h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/40">
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
          <button
            onClick={toggleFavorite}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
          >
            <i className={`ph-bold ${isFavorite ? 'ph-heart' : 'ph-heart'} text-xl`}></i>
            <span className="text-xs font-medium">{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
          >
            <i className="ph-bold ph-share-network text-xl"></i>
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
