export type PropertyCategory = 'accommodation' | 'experience' | 'services';

export type ListingStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: PropertyCategory;
  location: string;
  price: number;
  priceType?: 'month' | 'night' | 'hour';
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxOccupants?: number;
  amenities: string[];
  rating?: number;
  reviews?: number;
  landlord: {
    name: string;
    phone?: string;
    email?: string;
    image?: string;
    verified?: boolean;
  };
  verified: boolean;
  featured: boolean;
  available?: boolean;
  // Student space and roommate options
  isStudentSpace?: boolean;
  needsRoommates?: boolean;
  roommatesNeeded?: number;
  // Verification status
  status?: ListingStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export const propertyCategories = [
  'All Categories',
  'Accommodation',
  'Experience',
  'Services'
];

export const propertyTypes = [
  "All Types",
  "Hostel",
  "Apartment",
  "House",
  "Room"
];

export const locations = [
  "All Locations",
  "Lagos",
  "Abuja",
  "Ibadan",
  "Port Harcourt",
  "Kano",
  "Enugu"
];

export const priceRanges: PriceRange[] = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: '₦0 - ₦50,000', min: 0, max: 50000 },
  { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
  { label: '₦100,000 - ₦200,000', min: 100000, max: 200000 },
  { label: '₦200,000 - ₦500,000', min: 200000, max: 500000 },
  { label: '₦500,000+', min: 500000, max: Infinity }
];

export const mockProperties: Property[] = [
  {
    id: "prop_001",
    title: "The Hive Modern Hostel",
    description: "A modern hostel with premium amenities located in the heart of Lagos. Perfect for students who want a vibrant social environment.",
    type: "Hostel",
    category: 'accommodation',
    location: "Lagos",
    price: 45000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 4,
    bathrooms: 2,
    maxOccupants: 4,
    amenities: ["WiFi", "Furnished", "Air Conditioning", "Kitchen", "Laundry", "Security"],
    landlord: {
      name: "John Property Management",
      phone: "+2348012345678",
      email: "john@propmgmt.com",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.8,
    reviews: 124,
    verified: true,
    featured: true,
    available: true
  },
  {
    id: "prop_002",
    title: "Skyline Apartments",
    description: "Luxury self-contained apartments with stunning city views. Modern finishes and 24/7 security.",
    type: "Apartment",
    category: 'accommodation',
    location: "Abuja",
    price: 150000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 2,
    bathrooms: 2,
    maxOccupants: 2,
    amenities: ["WiFi", "Furnished", "Air Conditioning", "Kitchen", "Parking", "Security", "Gym"],
    landlord: {
      name: "Sarah Properties",
      phone: "+2348098765432",
      email: "sarah@properties.com",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.6,
    reviews: 89,
    verified: true,
    featured: true,
    available: true
  },
  {
    id: "prop_003",
    title: "Cozy Studio Room",
    description: "Private studio room in a shared apartment. Ideal for students who prefer privacy while having roommates.",
    type: "Room",
    category: 'accommodation',
    location: "Ibadan",
    price: 25000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    amenities: ["WiFi", "Furnished", "Air Conditioning"],
    landlord: {
      name: "Easy Living Rentals",
      phone: "+2347051234567",
      email: "info@easyliving.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.4,
    reviews: 56,
    verified: true,
    featured: false,
    available: true
  },
  {
    id: "prop_004",
    title: "Grand Villa House",
    description: "Spacious 3-bedroom house perfect for groups of students or students with families.",
    type: "House",
    category: 'accommodation',
    location: "Port Harcourt",
    price: 200000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 3,
    bathrooms: 2,
    maxOccupants: 4,
    amenities: ["WiFi", "Furnished", "Air Conditioning", "Kitchen", "Parking", "Security", "Garden"],
    landlord: {
      name: "Premier Estates",
      phone: "+2348023456789",
      email: "contact@premierestates.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.5,
    reviews: 34,
    verified: true,
    featured: false,
    available: true
  },
  {
    id: "prop_005",
    title: "Campus View Hostel",
    description: "Located right next to the university campus. Walking distance to all facilities.",
    type: "Hostel",
    category: 'accommodation',
    location: "Enugu",
    price: 35000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 4,
    bathrooms: 2,
    maxOccupants: 4,
    amenities: ["WiFi", "Furnished", "Study Area", "Laundry", "Security"],
    landlord: {
      name: "Campus Living",
      phone: "+2348034567890",
      email: "hello@campusliving.com",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.7,
    reviews: 78,
    verified: true,
    featured: true,
    available: true
  },
  {
    id: "prop_006",
    title: "Modern Loft Apartment",
    description: "Contemporary loft-style apartment with high ceilings and industrial design elements.",
    type: "Apartment",
    category: 'accommodation',
    location: "Lagos",
    price: 180000,
    priceType: 'month',
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: ["WiFi", "Furnished", "Air Conditioning", "Gym", "Rooftop", "Security"],
    landlord: {
      name: "Urban Spaces",
      phone: "+2348045678901",
      email: "info@urbanspaces.com",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.9,
    reviews: 156,
    verified: true,
    featured: false,
    available: true
  },
  // Experience Listings
  {
    id: "exp_001",
    title: "Lagos City Food Tour",
    description: "Experience the best of Lagos cuisine with our guided food tour.",
    type: "Experience",
    category: 'experience',
    location: "Lagos",
    price: 50,
    priceType: 'night',
    images: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    bedrooms: 0,
    bathrooms: 0,
    maxOccupants: 0,
    amenities: ["Guide", "Food Included", "Transport"],
    landlord: {
      name: "Nigerian Adventures",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.9,
    reviews: 89,
    verified: true,
    featured: true,
    available: true
  },
  // Services Listings
  {
    id: "srv_001",
    title: "Premium Cleaning Services",
    description: "Professional cleaning services for your property.",
    type: "Services",
    category: 'services',
    location: "Lagos",
    price: 30,
    priceType: 'hour',
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695b5f4bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    bedrooms: 0,
    bathrooms: 0,
    maxOccupants: 0,
    amenities: ["Professional", "Eco-friendly", "Supplies"],
    landlord: {
      name: "CleanPro Services",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    rating: 4.8,
    reviews: 156,
    verified: true,
    featured: true,
    available: true
  }
];
