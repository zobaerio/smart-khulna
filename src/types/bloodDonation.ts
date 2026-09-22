export interface BloodDonor {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;
  phone: string;
  email?: string;
  districtId: string;
  upazila?: string;
  address?: string;
  isAvailable: boolean; // Ready to donate
  lastDonationDate?: string; // YYYY-MM-DD
  totalDonationsCount?: number;
  notes?: string;
  verifiedDonor?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BloodBankContact {
  id: string;
  name: string;
  districtId: string;
  upazila?: string;
  address: string;
  phone: string;
  alternatePhone?: string;
  operatingHours: string;
  type: 'hospital' | 'red_crescent' | 'sandhani' | 'quantum' | 'voluntary';
}
