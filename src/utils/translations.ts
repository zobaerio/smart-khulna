export type Language = 'bn' | 'en';

export interface Translations {
  [key: string]: {
    bn: string;
    en: string;
  };
}

export const translations: Record<string, { bn: string; en: string }> = {
  // App & Branding
  appName: { bn: 'স্মার্ট খুলনা', en: 'Smart Khulna' },
  appSubtitle: { bn: 'খুলনা বিভাগীয় ডিজিটাল নাগরিক সেবা ও কমিউনিটি ডিরেক্টরি', en: 'Khulna Division Digital Citizen Services & Community Directory' },
  officialPortal: { bn: 'অফিসিয়াল নাগরিক পোর্টাল', en: 'Official Citizen Portal' },
  divisionTitle: { bn: 'খুলনা বিভাগ (১০ জেলা)', en: 'Khulna Division (10 Districts)' },
  
  // Navigation Tabs
  home: { bn: 'হোম', en: 'Home' },
  services: { bn: 'সেবাসমূহ', en: 'Services' },
  community: { bn: 'কমিউনিটি', en: 'Community' },
  messages: { bn: 'বার্তা', en: 'Messages' },
  messaging: { bn: 'মেসেজ', en: 'Messages' },
  profile: { bn: 'প্রোফাইল', en: 'Profile' },
  myProfile: { bn: 'আমার প্রোফাইল', en: 'My Profile' },
  saved: { bn: 'সংরক্ষিত', en: 'Saved' },
  downloads: { bn: 'ডাউনলোড', en: 'Downloads' },
  download: { bn: 'ডাউনলোড', en: 'Downloads' },
  search: { bn: 'অনুসন্ধান', en: 'Search' },
  admin: { bn: 'অ্যাডমিন', en: 'Admin' },
  adminPanel: { bn: 'অ্যাডমিন প্যানেল', en: 'Admin Panel' },
  sos: { bn: 'জরুরি হেল্পলাইন', en: 'Emergency SOS' },
  install: { bn: 'ইনস্টল অ্যাপ', en: 'Install App' },
  
  // Header & Controls
  searchPlaceholder: { bn: 'যেকোনো সেবা, ডাক্তার, হাসপাতাল বা তথ্য খুঁজুন...', en: 'Search services, doctors, hospitals, or info...' },
  noticeLabel: { bn: 'জরুরি নোটিশ', en: 'Official Notice' },
  defaultNotice: { bn: 'স্মার্ট খুলনা ডিজিটাল নাগরিক সেবা ডিরেক্টরি প্ল্যাটফর্মে আপনাকে স্বাগতম • খুলনা বিভাগের ১০ জেলার সকল তথ্য ও জরুরি সেবা এখন এক ক্লিকেই হাতের মুঠোয় • ২৪/৭ নাগরিক সহায়তা', en: 'Welcome to Smart Khulna Digital Citizen Directory • All 10 district services and emergency assistance now at your fingertips • 24/7 Citizen Support' },
  allDistricts: { bn: 'সকল জেলা', en: 'All Districts' },
  selectDistrict: { bn: 'জেলা নির্বাচন করুন', en: 'Select District' },
  darkMode: { bn: 'ডার্ক মোড', en: 'Dark Mode' },
  lightMode: { bn: 'লাইট মোড', en: 'Light Mode' },
  language: { bn: 'ভাষা', en: 'Language' },
  switchLanguage: { bn: 'ভাষা পরিবর্তন করুন', en: 'Switch Language' },
  bangla: { bn: 'বাংলা', en: 'Bangla' },
  english: { bn: 'English', en: 'English' },

  // Auth & Account
  login: { bn: 'লগইন করুন', en: 'Sign In' },
  logout: { bn: 'লগআউট', en: 'Sign Out' },
  signUp: { bn: 'নিবন্ধন করুন', en: 'Sign Up' },
  guestUser: { bn: 'অতিথি নাগরিক', en: 'Guest Citizen' },
  loginToAccess: { bn: 'সম্পূর্ণ সুবিধা পেতে অনুগ্রহ করে লগইন করুন', en: 'Please sign in to access all features' },

  // Districts of Khulna
  khulna: { bn: 'খুলনা', en: 'Khulna' },
  bagerhat: { bn: 'বাগেরহাট', en: 'Bagerhat' },
  satkhira: { bn: 'সাতক্ষীরা', en: 'Satkhira' },
  jessore: { bn: 'যশোর', en: 'Jashore' },
  jhenaidah: { bn: 'ঝিনাইদহ', en: 'Jhenaidah' },
  magura: { bn: 'মাগুরা', en: 'Magura' },
  narail: { bn: 'নড়াইল', en: 'Narail' },
  kushtia: { bn: 'কুষ্টিয়া', en: 'Kushtia' },
  chuadanga: { bn: 'চুয়াডাঙ্গা', en: 'Chuadanga' },
  meherpur: { bn: 'মেহেরপুর', en: 'Meherpur' },

  // Quick Features Hubs
  bloodBank: { bn: 'ব্লাড ব্যাংক', en: 'Blood Bank' },
  findBlood: { bn: 'রক্তদাতা খুঁজুন', en: 'Find Donors' },
  tourism: { bn: 'দর্শনীয় স্থান', en: 'Tourism' },
  doctorFinder: { bn: 'ডাক্তার ও হাসপাতাল', en: 'Doctors & Hospitals' },
  weatherTide: { bn: 'আবহাওয়া ও জোয়ার-ভাটা', en: 'Weather & Tides' },
  civicComplaints: { bn: 'নাগরিক অভিযোগ', en: 'Citizen Complaints' },
  jobsCareer: { bn: 'চাকরি ও ক্যারিয়ার', en: 'Jobs & Career' },
  toletRent: { bn: 'বাসা ভাড়া (টু-লেট)', en: 'To-Let Rentals' },

  // Referral System
  referralCode: { bn: 'রেফারেল কোড', en: 'Referral Code' },
  referralLink: { bn: 'রেফারেল লিংক', en: 'Referral Link' },
  copyReferralLink: { bn: 'রেফারেল লিংক কপি করুন', en: 'Copy Referral Link' },
  copyLink: { bn: 'লিংক কপি', en: 'Copy Link' },
  copied: { bn: 'কপি হয়েছে!', en: 'Copied!' },
  referralSuccess: { bn: 'সফল রেফারেল', en: 'Successful Referrals' },
  totalReferrals: { bn: 'মোট রেফারেল', en: 'Total Referrals' },
  topReferrers: { bn: 'শীর্ষ রেফারার', en: 'Top Referrers' },
  topReferrersTitle: { bn: '🏆 শীর্ষ রেফারার লিডারবোর্ড', en: '🏆 Top Referrers Leaderboard' },
  inviteFriends: { bn: 'বন্ধুদের আমন্ত্রণ জানান', en: 'Invite Friends' },
  shareAndEarn: { bn: 'আপনার রেফারেল লিংক শেয়ার করে বন্ধুদের যুক্ত করুন এবং উচ্চতর ব্যাজ অর্জন করুন', en: 'Share your referral link with friends to level up your badges and community ranking' },
  zeroReferralsNote: { bn: 'আমন্ত্রণ লিংকের মাধ্যমে সদস্যরা সফলভাবে অ্যাকাউন্ট খুললেই সংখ্যা স্বয়ংক্রিয়ভাবে আপডেট হবে।', en: 'Referral count updates automatically whenever someone registers via your link.' },

  // Verification & Checklist
  verifiedBadge: { bn: 'স্মার্ট খুলনা ভেরিফাইড', en: 'Smart Khulna Verified' },
  verificationStatus: { bn: 'ভেরিফিকেশন স্ট্যাটাস', en: 'Verification Status' },
  getVerified: { bn: 'ভেরিফাইড টিক গ্রহণ করুন', en: 'Get Verified' },
  verified: { bn: 'ভেরিফাইড', en: 'Verified' },
  unverified: { bn: 'আন-ভেরিফাইড', en: 'Unverified' },
  eligible: { bn: 'ভেরিফিকেশনের জন্য যোগ্য', en: 'Eligible for Verification' },
  pendingReview: { bn: 'পর্যালোচনাধীন', en: 'Under Review' },
  applyForVerification: { bn: 'ভেরিফিকেশনের আবেদন করুন', en: 'Apply for Verification' },
  checklistTitle: { bn: 'ভেরিফিকেশন চেকলিস্ট ও রুলস', en: 'Verification Checklist & Rules' },
  ruleProfileComplete: { bn: 'নাগরিক প্রোফাইল ১০০% সম্পন্ন', en: 'Citizen Profile 100% Complete' },
  ruleInvites: { bn: '৫ জন নাগরিককে আমন্ত্রণ (Invites)', en: 'Invite 5 Citizens' },
  ruleStreakOrInvites: { 
    bn: 'টানা ৭ দিন ১টি করে পোস্ট অথবা ৫+৫=১০ জন নাগরিককে আমন্ত্রণ', 
    en: '7-Day Daily Post Streak OR 10 Total Citizen Invites' 
  },
  ruleStreakOrInvitesDesc: { 
    bn: 'টানা ৭ দিন প্রতিদিন অন্তত ১টি করে পোস্ট করুন অথবা ১০ জনকে রেফার করুন। টানা ৭ দিন পোস্ট করতে না পারলে সমস্যা নেই, সেক্ষেত্রে ৫+৫=১০ জনকে ইনভাইট করলেই শর্ত পূরণ হয়ে যাবে!', 
    en: 'Post at least 1 post daily for 7 days OR invite 10 people. If you cannot post 7 days consecutively, inviting 5+5=10 people completely fulfills this requirement!' 
  },
  ruleDirectoryEntries: { bn: '৩টি স্থানীয় সেবা/তথ্য ডিরেক্টরিতে যুক্ত করা', en: 'Add 3 Local Directory Services' },
  rulePhotoPosts: { bn: '৩টি ছবিযুক্ত স্থানীয় তথ্যবহুল পোস্ট', en: 'Share 3 Photo-Rich Community Posts' },
  ruleGoodBehavior: { bn: 'উত্তম নাগরিক আচরণ (কোনো স্প্যাম বা রিপোর্ট নেই)', en: 'Good Civic Behavior (Zero spam or penalties)' },
  completedStatus: { bn: 'সম্পন্ন', en: 'Completed' },
  inProgressStatus: { bn: 'চলমান', en: 'In Progress' },
  achievedViaInvites: { bn: '১০ জন আমন্ত্রণের মাধ্যমে সম্পন্ন', en: 'Completed via 10 Invites' },
  achievedViaStreak: { bn: '৭ দিন পোস্ট স্ট্রিকের মাধ্যমে সম্পন্ন', en: 'Completed via 7-day Streak' },

  // Tiered Badges & Levels
  badgesAndLevels: { bn: 'ব্যাজ ও লেভেল অগ্রগতি', en: 'Badges & Level Progress' },
  currentTier: { bn: 'বর্তমান ব্যাজ লেভেল', en: 'Current Badge Level' },
  nextTier: { bn: 'পরবর্তী লেভেল', en: 'Next Level' },
  levelProgression: { bn: 'লেভেল প্রগ্রেস', en: 'Level Progress' },
  viewAllLevels: { bn: 'সকল ব্যাজ ও লেভেল দেখুন', en: 'View All Badges & Levels' },
  levelBronze: { bn: 'ব্রোঞ্জ নাগরিক', en: 'Bronze Citizen' },
  levelSilver: { bn: 'সিলভার কন্ট্রিবিউটর', en: 'Silver Contributor' },
  levelGold: { bn: 'গোল্ড কমিউনিটি লিডার', en: 'Gold Community Leader' },
  levelPlatinum: { bn: 'প্লাটিনাম চ্যাম্পিয়ন', en: 'Platinum Champion' },
  levelDiamond: { bn: 'ডায়মন্ড অ্যাম্বাসেডর', en: 'Diamond Ambassador' },

  // Community Feed
  createPost: { bn: 'নতুন পোস্ট তৈরি করুন', en: 'Create New Post' },
  postPlaceholder: { bn: 'খুলনা বিভাগ নিয়ে আপনার অভিজ্ঞতা, তথ্য বা প্রশ্ন শেয়ার করুন...', en: 'Share experiences, questions, or helpful local info about Khulna...' },
  feedAll: { bn: 'সকল পোস্ট', en: 'All Posts' },
  feedRecent: { bn: 'সাম্প্রতিক', en: 'Recent' },
  feedPopular: { bn: 'জনপ্রিয়', en: 'Popular' },
  feedQuestions: { bn: 'প্রশ্নোত্তর', en: 'Q&A' },
  feedGuides: { bn: 'গাইড ও তথ্য', en: 'Guides' },
  like: { bn: 'পছন্দ', en: 'Like' },
  comment: { bn: 'মন্তব্য', en: 'Comment' },
  share: { bn: 'শেয়ার', en: 'Share' },
  save: { bn: 'সংরক্ষণ', en: 'Save' },
  reply: { bn: 'উত্তর দিন', en: 'Reply' },
  writeComment: { bn: 'একটি সুন্দর মন্তব্য লিখুন...', en: 'Write a thoughtful comment...' },
  send: { bn: 'পাঠান', en: 'Send' },
  noPostsYet: { bn: 'এখনও কোনো পোস্ট পাওয়া যায়নি', en: 'No posts found yet' },

  // Map & Density
  districtDensityMap: { bn: 'খুলনা বিভাগীয় সেবা ডেনসিটি ম্যাপ', en: 'Khulna Division Service Density Map' },
  interactiveD3Map: { bn: 'ইন্টারেক্টিভ D3 নাগরিক মানচিত্র', en: 'Interactive D3 Civic Map' },
  filterByDistrict: { bn: 'জেলা অনুযায়ী সেবা ফিল্টার করুন', en: 'Filter services by district' },
  totalServicesInDistrict: { bn: 'মোট সেবা সংখ্যা', en: 'Total Services' },

  // Common UI Actions
  close: { bn: 'বন্ধ করুন', en: 'Close' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  confirm: { bn: 'নিশ্চিত করুন', en: 'Confirm' },
  saveChanges: { bn: 'পরিবর্তন সংরক্ষণ করুন', en: 'Save Changes' },
  edit: { bn: 'সম্পাদনা', en: 'Edit' },
  delete: { bn: 'মুছে ফেলুন', en: 'Delete' },
  loading: { bn: 'লোড হচ্ছে...', en: 'Loading...' },
  back: { bn: 'পেছনে যান', en: 'Back' },
  viewMore: { bn: 'আরও দেখুন', en: 'View More' },
  success: { bn: 'সফল হয়েছে', en: 'Success' },
  error: { bn: 'ত্রুটি ঘটেছে', en: 'An error occurred' },
};

export const getTranslation = (key: string, lang: Language, fallback?: string): string => {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return fallback || key;
};
