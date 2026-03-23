// Mock property data for the listings page

export type PropertyCategory = 'accommodation' | 'experience' | 'services';
export type ListingStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceType: 'month' | 'night' | 'hour';
  images: string[];
  bedrooms: number;
  bathrooms: number;
  type: 'hostel' | 'apartment' | 'house' | 'room';
  category: PropertyCategory;
  amenities: string[];
  rating: number;
  reviews: number;
  verified: boolean;
  available: boolean;
  landlord: {
    name: string;
    image: string;
    verified: boolean;
  };
  featured: boolean;
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

export const mockProperties: Property[] = [
  {
    id: 'prop_001',
    title: 'The Hive Modern Hostel',
    location: 'Kano, Nigeria',
    price: 350,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 4,
    bathrooms: 2,
    type: 'hostel',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'kitchen', 'laundry', 'study-area', 'security'],
    rating: 4.8,
    reviews: 124,
    verified: true,
    available: true,
    landlord: {
      name: 'Prime Properties',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: true,
    isStudentSpace: true,
    needsRoommates: true,
    roommatesNeeded: 2
  },
  {
    id: 'prop_002',
    title: 'Campus Residence Suites',
    location: 'Lagos, Nigeria',
    price: 500,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 2,
    bathrooms: 1,
    type: 'apartment',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'ac', 'gym', 'parking'],
    rating: 4.6,
    reviews: 89,
    verified: true,
    available: true,
    landlord: {
      name: 'Sofia Martinez',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false,
    isStudentSpace: true,
    needsRoommates: true,
    roommatesNeeded: 1
  },
  {
    id: 'prop_003',
    title: 'Cozy Student Dorm',
    location: 'Abuja, Nigeria',
    price: 280,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 6,
    bathrooms: 3,
    type: 'hostel',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'kitchen', 'laundry'],
    rating: 4.4,
    reviews: 56,
    verified: true,
    available: true,
    landlord: {
      name: 'John Property Management',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  },
  {
    id: 'prop_004',
    title: 'Modern Studio Apartment',
    location: 'Ibadan, Nigeria',
    price: 450,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 1,
    bathrooms: 1,
    type: 'apartment',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'ac', 'kitchen', 'security'],
    rating: 4.9,
    reviews: 42,
    verified: true,
    available: true,
    landlord: {
      name: 'Affordable Housing Co.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: true
  },
  {
    id: 'prop_005',
    title: 'Shared Room in Luxury Villa',
    location: 'Port Harcourt, Nigeria',
    price: 380,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 3,
    bathrooms: 2,
    type: 'room',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'pool', 'gym', 'parking', 'ac'],
    rating: 4.7,
    reviews: 78,
    verified: true,
    available: true,
    landlord: {
      name: 'Prime Properties',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  },
  {
    id: 'prop_006',
    title: 'Private Student House',
    location: 'Enugu, Nigeria',
    price: 420,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 3,
    bathrooms: 2,
    type: 'house',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'kitchen', 'laundry', 'parking', 'security'],
    rating: 4.5,
    reviews: 34,
    verified: false,
    available: true,
    landlord: {
      name: 'Local Landlord',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100',
      verified: false
    },
    featured: false
  },
  {
    id: 'prop_007',
    title: 'Downtown Luxury Hostel',
    location: 'Lagos, Nigeria',
    price: 550,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 4,
    bathrooms: 4,
    type: 'hostel',
    category: 'accommodation',
    amenities: ['wifi', 'furnished', 'ac', 'gym', 'rooftop', 'security', 'laundry'],
    rating: 4.9,
    reviews: 156,
    verified: true,
    available: true,
    landlord: {
      name: 'Premium Stays',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: true
  },
  {
    id: 'prop_008',
    title: 'Budget Friendly Dorm',
    location: 'Kano, Nigeria',
    price: 180,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 8,
    bathrooms: 4,
    type: 'hostel',
    category: 'accommodation',
    amenities: ['wifi', 'laundry', 'security'],
    rating: 4.1,
    reviews: 210,
    verified: true,
    available: true,
    landlord: {
      name: 'Student Housing NGO',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  },
  // Experience Listings
  {
    id: 'exp_001',
    title: 'Lagos City Food Tour',
    location: 'Lagos, Nigeria',
    price: 50,
    priceType: 'night',
    images: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 0,
    bathrooms: 0,
    type: 'hostel',
    category: 'experience',
    amenities: ['guide', 'food-included', 'transport'],
    rating: 4.9,
    reviews: 89,
    verified: true,
    available: true,
    landlord: {
      name: 'Nigerian Adventures',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: true
  },
  {
    id: 'exp_002',
    title: 'Abuja Cultural Experience',
    location: 'Abuja, Nigeria',
    price: 75,
    priceType: 'night',
    images: [
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 0,
    bathrooms: 0,
    type: 'hostel',
    category: 'experience',
    amenities: ['guide', 'workshop', 'cultural'],
    rating: 4.7,
    reviews: 45,
    verified: true,
    available: true,
    landlord: {
      name: 'Cultural Tours Ltd',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  },
  // Services Listings
  {
    id: 'srv_001',
    title: 'Premium Cleaning Services',
    location: 'Lagos, Nigeria',
    price: 30,
    priceType: 'hour',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695b5f4bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 0,
    bathrooms: 0,
    type: 'hostel',
    category: 'services',
    amenities: ['professional', 'eco-friendly', 'supplies'],
    rating: 4.8,
    reviews: 156,
    verified: true,
    available: true,
    landlord: {
      name: 'CleanPro Services',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: true
  },
  {
    id: 'srv_002',
    title: 'Student Transport Service',
    location: 'Ibadan, Nigeria',
    price: 500,
    priceType: 'month',
    images: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 0,
    bathrooms: 0,
    type: 'hostel',
    category: 'services',
    amenities: ['daily-pickup', 'wifi', 'ac'],
    rating: 4.6,
    reviews: 78,
    verified: true,
    available: true,
    landlord: {
      name: 'Campus Ride',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  },
  {
    id: 'srv_003',
    title: 'Utility Bills Management',
    location: 'Port Harcourt, Nigeria',
    price: 25,
    priceType: 'hour',
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    bedrooms: 0,
    bathrooms: 0,
    type: 'hostel',
    category: 'services',
    amenities: ['bill-payment', '24/7', 'online'],
    rating: 4.5,
    reviews: 34,
    verified: true,
    available: true,
    landlord: {
      name: 'UtilityHub',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100',
      verified: true
    },
    featured: false
  }
];

export const locations = [
  'All Locations',
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Enugu'
];

export const propertyTypes = [
  'All Types',
  'Hostel',
  'Apartment',
  'House',
  'Room'
];

export const propertyCategories = [
  'All Categories',
  'Accommodation',
  'Experience',
  'Services'
];

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const priceRanges: PriceRange[] = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 - $400', min: 200, max: 400 },
  { label: '$400 - $600', min: 400, max: 600 },
  { label: '$600+', min: 600, max: Infinity }
];
