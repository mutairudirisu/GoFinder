export interface Listing {
  id: string;
  category: string;
  type: string;
  spaceType: string;
  host?: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  address: {
    country: string;
    building: string;
    street: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  basics: {
    guests: number;
    bedrooms: number;
    beds: number;
    hasLock: boolean | null;
  };
  amenities: string[];
  photos: string[];
  title: string;
  highlights: string[];
  description: string;
  price: number;
  securityCharge: number;
  otherCharges: number;
  paymentFrequency: "MONTHLY" | "QUARTERLY" | "YEARLY";
  status: "IN_PROGRESS" | "ACTION_REQUIRED" | "VERIFIED" | "INACTIVE" | "REJECTED" | "BOOKED";
  createdAt: string;
}
