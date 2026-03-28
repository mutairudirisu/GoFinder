export type Role = "lister" | "renter" | "both";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isProfileComplete: boolean;
}