// SMART KHULNA DATA STRUCTURE & SEEDING UTILITIES

export interface District {
  id: string;
  name: string; // Bangla
  nameEn: string;
  image: string;
  serviceCount?: number;
}

export interface Category {
  id: string;
  name: string; // Bangla
  nameEn: string;
  iconName: string; // Lucide icon name
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  districtId: string; // empty means National Helpline
  iconName: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  district_id: string;
  upazila_id: string;
  address: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  is_verified: boolean;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'NEEDS_CHANGES';
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  photos?: string[];
  isFeatured?: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  role: 'super_admin' | 'sub_admin' | 'user';
  selectedDistrict?: string;
  savedServices?: string[];
  subAdminScope?: {
    districtId?: string;
    categoryId?: string;
  };
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetDistrictId?: string;
  targetCategoryId?: string;
  createdAt: string;
  expiryDate?: string;
}

// 1. Initial 10 Districts
export const initialDistricts: District[] = [
  { id: 'khulna', name: 'খুলনা', nameEn: 'Khulna', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=500&q=80' },
  { id: 'bagerhat', name: 'বাগেরহাট', nameEn: 'Bagerhat', image: 'https://images.unsplash.com/photo-1626014303757-6ea640d57f84?w=500&q=80' },
  { id: 'satkhira', name: 'সাতক্ষীরা', nameEn: 'Satkhira', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&q=80' },
  { id: 'jashore', name: 'যশোর', nameEn: 'Jashore', image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=500&q=80' },
  { id: 'jhenaidah', name: 'ঝিনাইদহ', nameEn: 'Jhenaidah', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&q=80' },
  { id: 'magura', name: 'মাগুরা', nameEn: 'Magura', image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=500&q=80' },
  { id: 'narail', name: 'নড়াইল', nameEn: 'Narail', image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392c?w=500&q=80' },
  { id: 'kushtia', name: 'কুষ্টিয়া', nameEn: 'Kushtia', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80' },
  { id: 'chuadanga', name: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80' },
  { id: 'meherpur', name: 'মেহেরপুর', nameEn: 'Meherpur', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80' },
];

// 2. Initial 21 Categories
export const initialCategories: Category[] = [
  { id: 'govt', name: 'সরকারি ও প্রশাসনিক সেবা', nameEn: 'Government & Administrative', iconName: 'Building2' },
  { id: 'health', name: 'স্বাস্থ্য সেবা', nameEn: 'Health Service', iconName: 'HeartPulse' },
  { id: 'education', name: 'শিক্ষা সেবা', nameEn: 'Education Service', iconName: 'GraduationCap' },
  { id: 'transport', name: 'পরিবহন সেবা', nameEn: 'Transport Service', iconName: 'Bus' },
  { id: 'banking', name: 'ব্যাংকিং সেবা', nameEn: 'Banking Service', iconName: 'Landmark' },
  { id: 'courier', name: 'কুরিয়ার সেবা', nameEn: 'Courier Service', iconName: 'Truck' },
  { id: 'lawyer', name: 'আইন ও আইনজীবী', nameEn: 'Law & Lawyers', iconName: 'Scale' },
  { id: 'local', name: 'স্থানীয় সেবা', nameEn: 'Local Service', iconName: 'MapPin' },
  { id: 'agriculture', name: 'কৃষি সেবা', nameEn: 'Agriculture Service', iconName: 'Sprout' },
  { id: 'business', name: 'ব্যবসা ও বাণিজ্য', nameEn: 'Business & Commerce', iconName: 'Briefcase' },
  { id: 'realestate', name: 'আবাসন ও রিয়েল এস্টেট', nameEn: 'Housing & Real Estate', iconName: 'Home' },
  { id: 'engineering', name: 'নির্মাণ ও ইঞ্জিনিয়ারিং', nameEn: 'Construction & Engineering', iconName: 'HardHat' },
  { id: 'professional', name: 'পেশাজীবী সেবা', nameEn: 'Professional Service', iconName: 'UserCheck' },
  { id: 'car', name: 'কার সার্ভিস', nameEn: 'Car Service', iconName: 'Car' },
  { id: 'electrician', name: 'ইলেকট্রিশিয়ান', nameEn: 'Electrician', iconName: 'Zap' },
  { id: 'plumber', name: 'প্লাম্বার', nameEn: 'Plumber', iconName: 'Wrench' },
  { id: 'mechanic', name: 'মেকানিক', nameEn: 'Mechanic', iconName: 'Settings' },
  { id: 'restaurant', name: 'রেস্টুরেন্ট', nameEn: 'Restaurant', iconName: 'Utensils' },
  { id: 'hotel', name: 'হোটেল', nameEn: 'Hotel', iconName: 'Bed' },
  { id: 'tourism', name: 'পর্যটন', nameEn: 'Tourism', iconName: 'Compass' },
  { id: 'other', name: 'অন্যান্য সেবা', nameEn: 'Other Services', iconName: 'Grid' },
];

// 3. Emergency Contacts
export const initialEmergencyContacts: EmergencyContact[] = [
  { id: 'nat-999', name: 'জাতীয় হেল্পলাইন (৯৯৯)', phone: '999', districtId: '', iconName: 'PhoneCall', description: 'জরুরি সেবা' },
  { id: 'nat-333', name: 'জাতীয় তথ্য ও সেবা (৩৩৩)', phone: '333', districtId: '', iconName: 'Info', description: 'সরকারি তথ্য' },
  { id: 'nat-109', name: 'নারী ও শিশু নির্যাতন প্রতিরোধ', phone: '109', districtId: '', iconName: 'ShieldAlert', description: 'সহায়তা হেল্পলাইন' },
  { id: 'police-khulna', name: 'খুলনা মেট্রোপলিটন পুলিশ কন্ট্রোল রুম', phone: '01713-373265', districtId: 'khulna', iconName: 'Shield', description: 'পুলিশ প্রশাসন' },
  { id: 'fire-khulna', name: 'খুলনা ফায়ার সার্ভিস স্টেশন', phone: '02-477722222', districtId: 'khulna', iconName: 'Flame', description: 'অগ্নি নির্বাপক' },
  { id: 'amb-khulna', name: 'খুলনা মেডিকেল কলেজ অ্যাম্বুলেন্স', phone: '01711-295328', districtId: 'khulna', iconName: 'Ambulance', description: 'জরুরি অ্যাম্বুলেন্স' },
  { id: 'police-jashore', name: 'যশোর জেলা পুলিশ কন্ট্রোল রুম', phone: '01713-374151', districtId: 'jashore', iconName: 'Shield', description: 'পুলিশ প্রশাসন' },
  { id: 'fire-jashore', name: 'যশোর ফায়ার সার্ভিস স্টেশন', phone: '02-42168555', districtId: 'jashore', iconName: 'Flame', description: 'অগ্নি নির্বাপক' },
  { id: 'police-satkhira', name: 'সাতক্ষীরা পুলিশ কন্ট্রোল রুম', phone: '01713-374189', districtId: 'satkhira', iconName: 'Shield', description: 'পুলিশ প্রশাসন' },
  { id: 'fire-satkhira', name: 'সাতক্ষীরা ফায়ার সার্ভিস', phone: '01730-002236', districtId: 'satkhira', iconName: 'Flame', description: 'অগ্নি নির্বাপক' },
  { id: 'police-bagerhat', name: 'বাগেরহাট পুলিশ কন্ট্রোল রুম', phone: '01713-374242', districtId: 'bagerhat', iconName: 'Shield', description: 'পুলিশ' },
  { id: 'fire-bagerhat', name: 'বাগেরহাট ফায়ার সার্ভিস', phone: '01730-336699', districtId: 'bagerhat', iconName: 'Flame', description: 'ফায়ার স্টেশন' }
];

// 4. Initial Sample Services (Rich Data across 10 districts)
export const initialServices: Service[] = [
  // Khulna
  {
    id: 'kh-kmch',
    name: 'খুলনা মেডিকেল কলেজ হাসপাতাল (KMCH)',
    slug: 'khulna-medical-college-hospital',
    description: 'খুলনা বিভাগের সর্ববৃহৎ সরকারি হাসপাতাল ও চিকিৎসা মহাবিদ্যালয়। এখানে ২৪ ঘণ্টা জরুরি সেবা, আইসিইউ এবং বিশেষজ্ঞ পরামর্শ পাওয়া যায়। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'khulna',
    upazila_id: 'khulna-sadar',
    address: 'কেডিএ অ্যাভিনিউ, খুলনা ৯০০০',
    phone: '01711-123456',
    alternate_phone: '02-477762234',
    email: 'info@kmch.gov.bd',
    website: 'https://kmch.gov.bd',
    facebook: 'https://facebook.com/kmch.official',
    latitude: 22.8234,
    longitude: 89.5423,
    opening_hours: '২৪ ঘণ্টা খোলা (জরুরি বিভাগ)',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'],
    isFeatured: true
  },
  {
    id: 'kh-police',
    name: 'খুলনা সদর থানা (Khulna Sadar Police Station)',
    slug: 'khulna-sadar-police-station',
    description: 'খুলনা মহানগরী এলাকার আইন শৃঙ্খলা ও নিরাপত্তা সহায়তার জন্য প্রধান থানা কার্যালয়। (ডিমো ডেটা)',
    category_id: 'govt',
    district_id: 'khulna',
    upazila_id: 'khulna-sadar',
    address: 'থানা রোড, রূপসা ঘাট সংলগ্ন, খুলনা',
    phone: '01713-373265',
    latitude: 22.8122,
    longitude: 89.5633,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: []
  },
  {
    id: 'kh-rupsha',
    name: 'রূপসা সেতু ভিউ রেস্টুরেন্ট',
    slug: 'rupsha-bridge-view-restaurant',
    description: 'খান জাহান আলী (রূপসা) সেতুর মনোরম দৃশ্য উপভোগ করতে করতে ঐতিহ্যবাহী খুলনার চুইঝাল মাংস ও স্থানীয় খাবার উপভোগ করার সেরা স্থান। (ডিমো ডেটা)',
    category_id: 'restaurant',
    district_id: 'khulna',
    upazila_id: 'rupsha',
    address: 'রূপসা সেতু পূর্ব প্রান্ত, খুলনা',
    phone: '01911-987654',
    latitude: 22.7889,
    longitude: 89.5891,
    opening_hours: 'সকাল ১১:০০ - রাত ১১:০০',
    is_verified: false,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80']
  },

  // Bagerhat
  {
    id: 'bg-shaitgumbad',
    name: 'ষাট গম্বুজ মসজিদ ও জাদুঘর',
    slug: 'sixty-dome-mosque-bagerhat',
    description: 'ইউনেস্কো ঘোষিত বিশ্ব ঐতিহ্যবাহী স্থান। ১৫ শতকে পীর খান জাহান আলী কর্তৃক নির্মিত ঐতিহাসিক মসজিদ ও প্রাচীন মুসলিম স্থাপত্যের অপূর্ব নিদর্শন। (ডিমো ডেটা)',
    category_id: 'tourism',
    district_id: 'bagerhat',
    upazila_id: 'bagerhat-sadar',
    address: 'ষাটগম্বুজ, বাগেরহাট সদর, বাগেরহাট',
    phone: '01712-445566',
    website: 'https://bangladesh.gov.bd',
    latitude: 22.6738,
    longitude: 89.7421,
    opening_hours: 'সকাল ০৯:০০ - বিকাল ০৫:০০ (রবিবার বন্ধ)',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1626014303757-6ea640d57f84?w=800&q=80'],
    isFeatured: true
  },
  {
    id: 'bg-sadar-hosp',
    name: 'বাগেরহাট সদর হাসপাতাল',
    slug: 'bagerhat-sadar-hospital',
    description: 'বাগেরহাট জেলা শহরের প্রধান সরকারি সাধারণ স্বাস্থ্যসেবা কেন্দ্র ও আধুনিক হাসপাতাল। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'bagerhat',
    upazila_id: 'bagerhat-sadar',
    address: 'হাসপাতাল রোড, বাগেরহাট',
    phone: '01713-556677',
    latitude: 22.6612,
    longitude: 89.7892,
    opening_hours: '২৪ ঘণ্টা খোলা (জরুরি বিভাগ)',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: []
  },

  // Satkhira
  {
    id: 'sk-sadar-hosp',
    name: 'সাতক্ষীরা সদর হাসপাতাল',
    slug: 'satkhira-sadar-hospital',
    description: 'সাতক্ষীরা জেলা সদরের একমাত্র প্রধান সরকারি হাসপাতাল ও ১০০ শয্যাবিশিষ্ট সাধারণ স্বাস্থ্যসেবা কেন্দ্র। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'satkhira',
    upazila_id: 'satkhira-sadar',
    address: 'হাসপাতাল মোড়, সাতক্ষীরা সদর',
    phone: '01715-998811',
    latitude: 22.7115,
    longitude: 89.0712,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },
  {
    id: 'sk-resort',
    name: 'সুন্দরবন রিভার ভিউ ক্যাফে ও রিসোর্ট',
    slug: 'sundarbans-river-view-resort',
    description: 'সুন্দরবনের গা ঘেঁষে সাতক্ষীরার শ্যামনগরে অবস্থিত একটি আধুনিক ও প্রাকৃতিক বিলাসবহুল ইকো রিসোর্ট। (ডিমো ডেটা)',
    category_id: 'tourism',
    district_id: 'satkhira',
    upazila_id: 'shyamnagar',
    address: 'মুন্সীগঞ্জ, শ্যামনগর, সাতক্ষীরা',
    phone: '01822-223344',
    facebook: 'https://facebook.com/sundarbanview',
    latitude: 22.2155,
    longitude: 89.1554,
    opening_hours: '২৪ ঘণ্টা বুকিং চালু',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'],
    isFeatured: true
  },

  // Jashore
  {
    id: 'js-gen-hosp',
    name: 'যশোর জেনারেল হাসপাতাল (২৫০ শয্যা)',
    slug: 'jashore-general-hospital',
    description: 'যশোর জেলার প্রধান ও সুবৃহৎ চিকিৎসাকেন্দ্র। ২৫০ শয্যা বিশিষ্ট এই সরকারি হাসপাতালে আধুনিক প্যাথলজি ও জরুরি সেবা রয়েছে। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'jashore',
    upazila_id: 'jashore-sadar',
    address: 'জেনারেল হাসপাতাল রোড, যশোর সদর',
    phone: '02-42168912',
    alternate_phone: '01715-555666',
    latitude: 23.1678,
    longitude: 89.2134,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80']
  },
  {
    id: 'js-airport',
    name: 'যশোর বিমানবন্দর (JSR)',
    slug: 'jashore-airport-info',
    description: 'খুলনা বিভাগের একমাত্র সচল বিমানবন্দর যা ঢাকাসহ বিভিন্ন অভ্যন্তরীণ রুটে নিয়মিত বিমান সেবা পরিচালনা করে। (ডিমো ডেটা)',
    category_id: 'transport',
    district_id: 'jashore',
    upazila_id: 'jashore-sadar',
    address: 'যশোর সেনানিবাস এলাকা, যশোর',
    phone: '01711-888999',
    website: 'https://caab.gov.bd/jashore',
    latitude: 23.1834,
    longitude: 89.1623,
    opening_hours: 'ফ্লাইট শিডিউল অনুযায়ী',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },

  // Jhenaidah
  {
    id: 'jh-sadar',
    name: 'ঝিনাইদহ সদর হাসপাতাল',
    slug: 'jhenaidah-sadar-hospital',
    description: 'ঝিনাইদহ জেলা শহরের প্রধান সরকারি স্বাস্থ্যসেবা কেন্দ্র। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'jhenaidah',
    upazila_id: 'jhenaidah-sadar',
    address: 'হাসপাতাল মোড়, ঝিনাইদহ',
    phone: '01714-334455',
    latitude: 23.5412,
    longitude: 89.1823,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: false,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },

  // Magura
  {
    id: 'mg-sadar',
    name: 'মাগুরা সদর ২৫০ শয্যা বিশিষ্ট হাসপাতাল',
    slug: 'magura-sadar-hospital',
    description: 'মাগুরা জেলার সর্ববৃহৎ স্বাস্থ্যসেবা ও চিকিৎসা কমপ্লেক্স। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'magura',
    upazila_id: 'magura-sadar',
    address: 'ঢাকা-খুলনা হাইওয়ে সংলগ্ন, মাগুরা সদর',
    phone: '01716-112233',
    latitude: 23.4834,
    longitude: 89.4189,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },

  // Narail
  {
    id: 'nr-sadar',
    name: 'নড়াইল আধুনিক সদর হাসপাতাল',
    slug: 'narail-sadar-hospital',
    description: 'নড়াইল জেলাবাসীর নির্ভরযোগ্য সরকারি চিকিৎসা প্রতিষ্ঠান। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'narail',
    upazila_id: 'narail-sadar',
    address: 'হাসপাতাল রোড, নড়াইল সদর',
    phone: '01718-445533',
    latitude: 23.1667,
    longitude: 89.5000,
    opening_hours: '২৪ ঘণ্টা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },

  // Kushtia
  {
    id: 'ks-gen',
    name: 'কুষ্টিয়া জেনারেল হাসপাতাল',
    slug: 'kushtia-general-hospital',
    description: 'কুষ্টিয়া ও আশেপাশের অঞ্চলের প্রধান আধুনিক ২৫০ শয্যার চিকিৎসা ও রেফারেল কেন্দ্র। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'kushtia',
    upazila_id: 'kushtia-sadar',
    address: 'হাসপাতাল রোড, কুষ্টিয়া সদর',
    phone: '01719-778899',
    latitude: 23.9011,
    longitude: 89.1192,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },
  {
    id: 'ks-kuthibadi',
    name: 'রবীন্দ্রনাথের শিলাইদহ কুঠিবাড়ী',
    slug: 'rabindranath-shilaidaha-kuthibadi',
    description: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের স্মৃতিবিজড়িত ঐতিহাসিক তিন তলা প্রাসাদ ও ঐতিহ্যবাহী পর্যটন কেন্দ্র। (ডিমো ডেটা)',
    category_id: 'tourism',
    district_id: 'kushtia',
    upazila_id: 'kumarkhali',
    address: 'শিলাইদহ, কুমারখালী, কুষ্টিয়া',
    phone: '01711-332244',
    latitude: 23.9212,
    longitude: 89.2132,
    opening_hours: 'সকাল ১০:০০ - বিকাল ০৬:০০',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    isFeatured: true
  },

  // Chuadanga
  {
    id: 'cd-sadar',
    name: 'চুয়াডাঙ্গা সদর হাসপাতাল',
    slug: 'chuadanga-sadar-hospital',
    description: 'চুয়াডাঙ্গা জেলা শহরের প্রধান চিকিৎসা সেবা কেন্দ্র। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'chuadanga',
    upazila_id: 'chuadanga-sadar',
    address: 'হাসপাতাল মোড়, চুয়াডাঙ্গা',
    phone: '01720-112244',
    latitude: 23.6421,
    longitude: 88.8523,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },

  // Meherpur
  {
    id: 'mh-sadar',
    name: 'মেহেরপুর সাধারণ সদর হাসপাতাল',
    slug: 'meherpur-sadar-hospital',
    description: 'মেহেরপুর জেলার বৃহত্তম চিকিৎসা সেবা প্রদানকারী প্রতিষ্ঠান। (ডিমো ডেটা)',
    category_id: 'health',
    district_id: 'meherpur',
    upazila_id: 'meherpur-sadar',
    address: 'হাসপাতাল রোড, মেহেরপুর সদর',
    phone: '01722-334466',
    latitude: 23.7667,
    longitude: 88.6333,
    opening_hours: '২৪ ঘণ্টা খোলা',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z'
  },
  {
    id: 'mh-mujibnagar',
    name: 'ঐতিহাসিক মুজিবনগর স্মৃতিসৌধ',
    slug: 'historic-mujibnagar-memorial',
    description: 'বাংলাদেশের প্রথম অস্থায়ী সরকার যেখানে শপথ নিয়েছিল। মুক্তিযুদ্ধের স্মৃতিবিজড়িত একটি পবিত্র জাতীয় পর্যটন কেন্দ্র ও স্মৃতি কমপ্লেক্স। (ডিমো ডেটা)',
    category_id: 'tourism',
    district_id: 'meherpur',
    upazila_id: 'mujibnagar',
    address: 'মুজিবনগর, মেহেরপুর',
    phone: '01712-998800',
    latitude: 23.6512,
    longitude: 88.5290,
    opening_hours: 'সকাল ০৮:০০ - সন্ধ্যা ০৬:০০',
    is_verified: true,
    status: 'PUBLISHED',
    created_at: '2026-09-20T12:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    photos: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'],
    isFeatured: true
  }
];

// Helper to load/save state locally or to Firebase
// We'll manage state cleanly and robustly.

export interface PlatformDownloadConfig {
  enabled: boolean;
  version: string;
  fileSize?: string;
  downloadUrl?: string; // Direct APK, EXE, DMG, etc.
  storeUrl?: string; // Google Play, Apple App Store
  instructions?: string;
  badge?: string;
}

export interface AppReleaseConfig {
  currentVersion: string;
  minimumSupportedVersion: string;
  releaseDate: string;
  releaseNotes: string[];
  android: PlatformDownloadConfig;
  ios: PlatformDownloadConfig;
  windows: PlatformDownloadConfig;
  macos: PlatformDownloadConfig;
  linux: PlatformDownloadConfig;
  pwa: {
    enabled: boolean;
    version: string;
  };
}

export const defaultReleaseConfig: AppReleaseConfig = {
  currentVersion: '1.0.0',
  minimumSupportedVersion: '1.0.0',
  releaseDate: '2026-09-20',
  releaseNotes: [
    'খুলনা বিভাগের ১০টি জেলার সম্পূর্ণ ডিজিটাল সেবা তথ্য ভাণ্ডার',
    'জরুরি সেবা নম্বর সরাসরি এক ক্লিকে ডায়ালিং সুবিধা',
    'স্মার্ট জেমিনি এআই ও গুগল ম্যাপস গ্রাউন্ডিং সার্চ',
    'অফলাইন ক্যাশিং ও অ্যাপ হিসেবে হোমস্ক্রিনে ইনস্টল সুবিধা',
    'সহজ ও নির্ভরযোগ্য তথ্য যাচাইকরণ'
  ],
  android: {
    enabled: true,
    version: '1.0.0',
    fileSize: '18.4 MB',
    downloadUrl: '',
    storeUrl: '',
    instructions: 'গুগল প্লে স্টোর রিভিউ প্রক্রিয়াধীন। অথবা অ্যাডমিন প্রদত্ত নিরাপদ APK সরাসরি ইনস্টল করুন।',
    badge: 'AAB / APK প্রস্তুত'
  },
  ios: {
    enabled: true,
    version: '1.0.0',
    fileSize: '22.1 MB',
    downloadUrl: '',
    storeUrl: '',
    instructions: 'Apple App Store রিভিউ প্রক্রিয়াধীন। Safari ব্রাউজারের Share মেনু থেকে "Add to Home Screen" করুন।',
    badge: 'iPhone / iPad'
  },
  windows: {
    enabled: true,
    version: '1.0.0',
    fileSize: '48.6 MB',
    downloadUrl: '',
    storeUrl: '',
    instructions: 'Windows 10 / 11 এর জন্য .exe অথবা ক্রোমিয়াম বেসড ডেস্কটপ PWA ইনস্টলার।',
    badge: 'Win 10/11'
  },
  macos: {
    enabled: true,
    version: '1.0.0',
    fileSize: '52.3 MB',
    downloadUrl: '',
    storeUrl: '',
    instructions: 'Apple Silicon (M1/M2/M3/M4) এবং Intel Mac এর জন্য .dmg প্যাকেজ অথবা PWA।',
    badge: 'macOS 12+'
  },
  linux: {
    enabled: true,
    version: '1.0.0',
    fileSize: '44.8 MB',
    downloadUrl: '',
    storeUrl: '',
    instructions: 'Ubuntu, Debian, Fedora ইত্যাদির জন্য AppImage / .deb প্যাকেজ অথবা ব্রাউজার PWA।',
    badge: 'AppImage / .deb'
  },
  pwa: {
    enabled: true,
    version: '1.0.0'
  }
};

export const saveLocalData = (key: string, data: any) => {
  localStorage.setItem(`smart_khulna_${key}`, JSON.stringify(data));
};

export const getLocalData = (key: string, fallback: any) => {
  const item = localStorage.getItem(`smart_khulna_${key}`);
  return item ? JSON.parse(item) : fallback;
};
