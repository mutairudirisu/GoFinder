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
  isStudentSpace?: boolean;
  needsRoommates?: boolean;
  roommatesNeeded?: number;
  status?: ListingStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
