export interface Listing {
  id: string;
  category: string;
  type: string;
  spaceType?: string;
  host?: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  address: {
    country: string;
<<<<<<< HEAD
    houseNumber?: string;
    landmark?: string;
    building?: string;
    unit?: string;
    street: string;
    district?: string;
=======
    building: string;
    street: string;
    district: string;
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    city: string;
    province: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  basics?: {
    guests: number;
    bedrooms?: number;
    beds?: number;
    hasLock?: boolean | null;
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
<<<<<<< HEAD
  studentHousing?: {
    forStudents: boolean;
    needsRoommate: boolean;
    roommateSlots?: number;
  };
  status: "IN_PROGRESS" | "ACTION_REQUIRED" | "VERIFIED" | "INACTIVE" | "REJECTED" | "BOOKED" | "PUBLISHED";
  createdAt: string;
}

export const isStudentFriendlyListing = (listing: Listing) => {
  return Boolean(
    listing.studentHousing?.forStudents ||
      String(listing.type).toLowerCase() === "student_accommodation" ||
      listing.spaceType === "shared_student"
  );
};

export const isRoommateFriendlyListing = (listing: Listing) => {
  const type = String(listing.type).toLowerCase();
  return Boolean(
    listing.studentHousing?.needsRoommate ||
      listing.spaceType === "shared" ||
      listing.spaceType === "shared_student" ||
      listing.spaceType === "shared_hotel_guesthouse" ||
      type === "shared_room" ||
      type === "student_accommodation" ||
      type === "hostel"
  );
};
=======
  status: "IN_PROGRESS" | "ACTION_REQUIRED" | "VERIFIED" | "INACTIVE" | "REJECTED" | "BOOKED" | "PUBLISHED";
  createdAt: string;
}
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
