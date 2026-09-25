export interface OfflineEmergencyItem {
  id: string;
  name: string;
  nameEn?: string;
  category: 'national' | 'police' | 'fire' | 'ambulance' | 'hospital' | 'electricity' | 'blood';
  categoryLabel: string;
  phone: string;
  alternatePhone?: string;
  districtId: string; // 'national' | 'khulna' | 'satkhira' | 'bagerhat' | 'jashore' | 'kushtia' | 'jhenaidah' | 'magura' | 'chuadanga' | 'meherpur' | 'narail'
  districtName: string;
  upazilaName?: string;
  description: string;
  is24Hours?: boolean;
  priority?: number;
}

export const offlineEmergencyDirectory: OfflineEmergencyItem[] = [
  // 1. NATIONAL HELPLINES (ALL BANGLADESH)
  {
    id: 'nat-999',
    name: 'জাতীয় জরুরি সেবা (৯৯৯)',
    nameEn: 'National Emergency Service (999)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '999',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জন্য ২৪ ঘণ্টা টোল-ফ্রি জরুরি সেবা।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'nat-333',
    name: 'জাতীয় তথ্য ও নাগরিক সেবা (৩৩৩)',
    nameEn: 'National Information & Citizen Service (333)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '333',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: 'সরকারি সেবা, ই-সেবা তথ্য, করোনা পরামর্শ ও সামাজিক সমস্যার অভিযোগ হেল্পলাইন।',
    is24Hours: true,
    priority: 2
  },
  {
    id: 'nat-109',
    name: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন (১০৯)',
    nameEn: 'Violence Against Women & Children Helpline (109)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '109',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: 'নারী ও শিশুদের যেকোনো হয়রানি, নির্যাতন ও বাল্যবিয়ে প্রতিরোধে তাৎক্ষণিক সহায়তা।',
    is24Hours: true,
    priority: 3
  },
  {
    id: 'nat-16263',
    name: 'স্বাস্থ্য বাতায়ন (১৬২৬৩)',
    nameEn: 'Shastho Batayon (16263)',
    category: 'hospital',
    categoryLabel: 'স্বাস্থ্য ও ডাক্তার',
    phone: '16263',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: '২৪ ঘণ্টা রেজিস্টার্ড চিকিৎসকের বিনামূল্যে সরাসরি জরুরি স্বাস্থ্য পরামর্শ।',
    is24Hours: true,
    priority: 4
  },
  {
    id: 'nat-1090',
    name: 'দুর্যোগের আগাম বার্তা ও আবহাওয়া (১০৯০)',
    nameEn: 'Disaster Warning & Weather (1090)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '1090',
    districtId: 'national',
    districtName: 'উপকূলীয় ও সারাদেশে',
    description: 'ঘূর্ণিঝড়, বন্যা, নদীভাঙন ও আবহাওয়ার সতর্কতা সংকেতের সরকারি বার্তা।',
    is24Hours: true,
    priority: 5
  },
  {
    id: 'nat-106',
    name: 'দুর্নীতি দমন কমিশন হেল্পলাইন (১০৬)',
    nameEn: 'Anti-Corruption Commission Helpline (106)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '106',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: 'ঘুষ, দুর্নীতি বা অনিয়মের তথ্য সরাসরি অবহিত করার হটলাইন।',
    is24Hours: false,
    priority: 6
  },
  {
    id: 'nat-16575',
    name: 'চাইল্ড হেল্পলাইন (১০৯৮ / ১৬৫৭৫)',
    nameEn: 'Child Helpline (1098 / 16575)',
    category: 'national',
    categoryLabel: 'জাতীয় হেল্পলাইন',
    phone: '1098',
    alternatePhone: '16575',
    districtId: 'national',
    districtName: 'সারাদেশ',
    description: 'ঝুঁকিতে থাকা শিশুদের সুরক্ষা, পুনর্বাসন ও আইনি সুরক্ষায় ২৪ ঘণ্টা।',
    is24Hours: true,
    priority: 7
  },

  // 2. KHULNA DISTRICT
  {
    id: 'kh-police-control',
    name: 'খুলনা মেট্রোপলিটন পুলিশ (KMP) কন্ট্রোল রুম',
    nameEn: 'KMP Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-373265',
    alternatePhone: '02-477722223',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'খুলনা মহানগর',
    description: 'খুলনা মহানগরী এলাকার জরুরি আইনশৃঙ্খলা সহায়তা ও পুলিশ টিম প্রেরণ।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'kh-sadar-thana',
    name: 'খুলনা সদর থানা ডিউটি অফিসার',
    nameEn: 'Khulna Sadar Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-143000',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'খুলনা সদর',
    description: 'খুলনা সদর ও আশপাশের জরুরি পুলিশি সহায়তা ও জিডি/অভিযোগ।',
    is24Hours: true
  },
  {
    id: 'kh-sonadanga-thana',
    name: 'সোনাডাঙ্গা মডেল থানা ডিউটি অফিসার',
    nameEn: 'Sonadanga Model Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-143100',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'সোনাডাঙ্গা',
    description: 'সোনাডাঙ্গা বাস টার্মিনাল ও সংলগ্ন এলাকার পুলিশ সহায়তা।',
    is24Hours: true
  },
  {
    id: 'kh-khalishpur-thana',
    name: 'খালিশপুর থানা ডিউটি অফিসার',
    nameEn: 'Khalishpur Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-143200',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'খালিশপুর',
    description: 'খালিশপুর শিল্প এলাকা ও আশপাশের নিরাপত্তা সহায়তা।',
    is24Hours: true
  },
  {
    id: 'kh-rupsha-thana',
    name: 'রূপসা থানা ডিউটি অফিসার',
    nameEn: 'Rupsha Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-143500',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'রূপসা',
    description: 'রূপসা উপজেলা ও সেতু সংলগ্ন এলাকার পুলিশ সেবা।',
    is24Hours: true
  },
  {
    id: 'kh-fire-hq',
    name: 'খুলনা ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন (বয়রা)',
    nameEn: 'Khulna Fire Service HQ Boyra',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '02-477722222',
    alternatePhone: '01730-002230',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'বয়রা / খুলনা',
    description: 'খুলনা মহানগরী ও তৎসংলগ্ন এলাকার প্রধান অগ্নিনির্বাপণ ও উদ্ধার দল।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'kh-kmch-emergency',
    name: 'খুলনা মেডিকেল কলেজ হাসপাতাল (KMCH) জরুরি বিভাগ',
    nameEn: 'Khulna Medical College Hospital Emergency',
    category: 'hospital',
    categoryLabel: 'জরুরি হাসপাতাল',
    phone: '01711-298527',
    alternatePhone: '02-477762234',
    districtId: 'khulna',
    districtName: 'খুলনা',
    upazilaName: 'কেডিএ এভিনিউ',
    description: '২৪ ঘণ্টা ট্রমা সেন্টার, জরুরি চিকিৎসা, আইসিইউ ও বিশেষজ্ঞ ডাক্তার।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'kh-kmch-ambulance',
    name: 'কেএমসিএইচ সরকারি অ্যাম্বুলেন্স কন্ট্রোল',
    nameEn: 'KMCH Govt Ambulance Control',
    category: 'ambulance',
    categoryLabel: 'অ্যাম্বুলেন্স ও অক্সিজেন',
    phone: '01711-295328',
    districtId: 'khulna',
    districtName: 'খুলনা',
    description: 'রোগী পরিবহন, অক্সিজেন সাপোর্ট ও জরুরি স্থানান্তর অ্যাম্বুলেন্স।',
    is24Hours: true
  },
  {
    id: 'kh-redcrescent-blood',
    name: 'খুলনা রেড ক্রিসেন্ট ব্লাড ব্যাংক',
    nameEn: 'Khulna Red Crescent Blood Bank',
    category: 'blood',
    categoryLabel: 'রক্তদান ও ব্লাড ব্যাংক',
    phone: '01712-085732',
    districtId: 'khulna',
    districtName: 'খুলনা',
    description: 'নিরাপদ রক্ত সংগ্রহ, ক্রস ম্যাচিং ও জরুরি রক্তের সরবরাহ।',
    is24Hours: true
  },
  {
    id: 'kh-wzpdcl-power',
    name: 'ওজোপাডিকো বিদ্যুৎ অভিযোগ কেন্দ্র (খুলনা)',
    nameEn: 'WZPDCL Power Complaint Center',
    category: 'electricity',
    categoryLabel: 'বিদ্যুৎ জরুরি অভিযোগ',
    phone: '16117',
    alternatePhone: '01713-850201',
    districtId: 'khulna',
    districtName: 'খুলনা',
    description: 'বিদ্যুৎ বিপর্যয়, ট্রান্সফরমার বিস্ফোরণ বা তার ছিঁড়ে যাওয়ার জরুরি রিপোর্ট।',
    is24Hours: true
  },

  // 3. SATKHIRA DISTRICT
  {
    id: 'sat-police-control',
    name: 'সাতক্ষীরা জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Satkhira Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374189',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    description: 'সাতক্ষীরা জেলার যেকোনো স্থানে জরুরি পুলিশ সহায়তা ও টহল টিম।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'sat-sadar-thana',
    name: 'সাতক্ষীরা সদর থানা ডিউটি অফিসার',
    nameEn: 'Satkhira Sadar Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-146300',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'সাতক্ষীরা সদর',
    description: 'সাতক্ষীরা সদর উপজেলা ও শহরের সার্বিক নিরাপত্তা সহায়তা।',
    is24Hours: true
  },
  {
    id: 'sat-kalaroa-thana',
    name: 'কলারোয়া থানা ডিউটি অফিসার',
    nameEn: 'Kalaroa Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-146400',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'কলারোয়া',
    description: 'কলারোয়া উপজেলার জরুরি পুলিশ সহায়তা।',
    is24Hours: true
  },
  {
    id: 'sat-tala-thana',
    name: 'তালা থানা ডিউটি অফিসার',
    nameEn: 'Tala Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-146500',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'তালা',
    description: 'তালা উপজেলার জরুরি নিরাপত্তা ও পুলিশ সহায়তা।',
    is24Hours: true
  },
  {
    id: 'sat-kaliganj-thana',
    name: 'কালীগঞ্জ থানা ডিউটি অফিসার (সাতক্ষীরা)',
    nameEn: 'Kaliganj Police Station Satkhira',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-146600',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'কালীগঞ্জ',
    description: 'কালীগঞ্জ উপজেলার জরুরি নিরাপত্তা ও সহায়তা।',
    is24Hours: true
  },
  {
    id: 'sat-shyamnagar-thana',
    name: 'শ্যামনগর থানা ডিউটি অফিসার',
    nameEn: 'Shyamnagar Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-146700',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'শ্যামনগর (উপকূলীয়)',
    description: 'সুন্দরবন উপকূল ও শ্যামনগর উপজেলার নিরাপত্তা ও নৌ-টহল।',
    is24Hours: true
  },
  {
    id: 'sat-fire-service',
    name: 'সাতক্ষীরা ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন',
    nameEn: 'Satkhira Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002236',
    alternatePhone: '02-477741122',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    upazilaName: 'সাতক্ষীরা সদর',
    description: 'সাতক্ষীরা জেলার প্রধান অগ্নি নির্বাপক ও দুর্ঘটনা উদ্ধার স্টেশন।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'sat-hospital-emergency',
    name: 'সাতক্ষীরা সদর হাসপাতাল ও মেডিকেল জরুরি বিভাগ',
    nameEn: 'Satkhira Sadar Hospital Emergency',
    category: 'hospital',
    categoryLabel: 'জরুরি হাসপাতাল',
    phone: '01716-419200',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    description: 'সাতক্ষীরা সদর হাসপাতালের জরুরি বিভাগ ও অন-কল ডাক্তার।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'sat-palli-bidyut',
    name: 'সাতক্ষীরা পল্লী বিদ্যুৎ সমিতি অভিযোগ কেন্দ্র',
    nameEn: 'Satkhira Palli Bidyut Complaint Center',
    category: 'electricity',
    categoryLabel: 'বিদ্যুৎ জরুরি অভিযোগ',
    phone: '01769-400100',
    districtId: 'satkhira',
    districtName: 'সাতক্ষীরা',
    description: 'সাতক্ষীরা জেলার পল্লী বিদ্যুৎ সংযোগ বিপর্যয় ও লাইন জরুরি অভিযোগ।',
    is24Hours: true
  },

  // 4. BAGERHAT DISTRICT
  {
    id: 'bag-police-control',
    name: 'বাগেরহাট পুলিশ কন্ট্রোল রুম',
    nameEn: 'Bagerhat Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374242',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    description: 'বাগেরহাট জেলার সার্বিক আইন শৃঙ্খলা ও জরুরি পুলিশ সহায়তা।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'bag-sadar-thana',
    name: 'বাগেরহাট সদর মডেল থানা',
    nameEn: 'Bagerhat Sadar Model Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-147300',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    upazilaName: 'বাগেরহাট সদর',
    description: 'বাগেরহাট শহর ও সদর উপজেলার পুলিশি সহায়তা।',
    is24Hours: true
  },
  {
    id: 'bag-mongla-thana',
    name: 'মোংলা পোর্ট থানা ডিউটি অফিসার',
    nameEn: 'Mongla Port Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-147400',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    upazilaName: 'মোংলা',
    description: 'মোংলা বন্দর ও শিল্প অঞ্চলের সার্বিক নিরাপত্তা।',
    is24Hours: true
  },
  {
    id: 'bag-fire-service',
    name: 'বাগেরহাট ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Bagerhat Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-336699',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    description: 'বাগেরহাট জেলায় অগ্নি দুর্ঘটনা ও উদ্ধার কাজের প্রধান টিম।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'bag-hospital-emergency',
    name: 'বাগেরহাট ২৫০ শয্যা বিশিষ্ট জেলা হাসপাতাল জরুরি বিভাগ',
    nameEn: 'Bagerhat District Hospital Emergency',
    category: 'hospital',
    categoryLabel: 'জরুরি হাসপাতাল',
    phone: '01712-345678',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    description: 'জরুরি চিকিৎসা, ড্রেসিং, অক্সিজেন ও রোগী ভর্তি।',
    is24Hours: true
  },

  // 5. JASHORE DISTRICT
  {
    id: 'jas-police-control',
    name: 'যশোর জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Jashore Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374151',
    districtId: 'jashore',
    districtName: 'যশোর',
    description: 'যশোর জেলা ও মহাসড়ক এলাকার সার্বিক পুলিশ সহায়তা।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'jas-kotwali-thana',
    name: 'যশোর কোতোয়ালী মডেল থানা',
    nameEn: 'Jashore Kotwali Model Police Station',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01320-145300',
    districtId: 'jashore',
    districtName: 'যশোর',
    upazilaName: 'যশোর সদর',
    description: 'যশোর সদর ও শহর এলাকার জরুরি পুলিশ সেবা।',
    is24Hours: true
  },
  {
    id: 'jas-fire-service',
    name: 'যশোর ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন',
    nameEn: 'Jashore Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '02-42168555',
    alternatePhone: '01730-002235',
    districtId: 'jashore',
    districtName: 'যশোর',
    description: 'যশোর জেলার প্রধান অগ্নিনির্বাপণ ও উদ্ধারকারী দল।',
    is24Hours: true,
    priority: 1
  },
  {
    id: 'jas-hospital-emergency',
    name: 'যশোর ২৫০ শয্যা জেনারেল হাসপাতাল জরুরি বিভাগ',
    nameEn: 'Jashore General Hospital Emergency',
    category: 'hospital',
    categoryLabel: 'জরুরি হাসপাতাল',
    phone: '01711-234567',
    districtId: 'jashore',
    districtName: 'যশোর',
    description: 'জরুরি চিকিৎসা, অ্যাম্বুলেন্স সহায়তা ও জরুরি অপারেশন থিয়েটার।',
    is24Hours: true,
    priority: 1
  },

  // 6. KUSHTIA DISTRICT
  {
    id: 'kus-police-control',
    name: 'কুষ্টিয়া জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Kushtia Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374116',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    description: 'কুষ্টিয়া সদর ও মহাসড়ক নিরাপত্তা সহায়তা।',
    is24Hours: true
  },
  {
    id: 'kus-fire-service',
    name: 'কুষ্টিয়া ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Kushtia Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002237',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    description: 'কুষ্টিয়া জেলার জরুরি অগ্নিনির্বাপক কন্ট্রোল।',
    is24Hours: true
  },
  {
    id: 'kus-hospital-emergency',
    name: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল জরুরি বিভাগ',
    nameEn: 'Kushtia General Hospital Emergency',
    category: 'hospital',
    categoryLabel: 'জরুরি হাসপাতাল',
    phone: '01712-987654',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    description: '২৪ ঘণ্টা জরুরি চিকিৎসা ও রোগী স্থানান্তর।',
    is24Hours: true
  },

  // 7. JHENAIDAH DISTRICT
  {
    id: 'jhe-police-control',
    name: 'ঝিনাইদহ জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Jhenaidah Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374134',
    districtId: 'jhenaidah',
    districtName: 'ঝিনাইদহ',
    description: 'ঝিনাইদহ জেলা পুলিশ সহায়তা কেন্দ্র।',
    is24Hours: true
  },
  {
    id: 'jhe-fire-service',
    name: 'ঝিনাইদহ ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Jhenaidah Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002238',
    districtId: 'jhenaidah',
    districtName: 'ঝিনাইদহ',
    description: 'ঝিনাইদহ জেলার জরুরি ফায়ার সার্ভিস কন্ট্রোল।',
    is24Hours: true
  },

  // 8. MAGURA DISTRICT
  {
    id: 'mag-police-control',
    name: 'মাগুরা জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Magura Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374168',
    districtId: 'magura',
    districtName: 'মাগুরা',
    description: 'মাগুরা জেলার জরুরি পুলিশ কন্ট্রোল রুম।',
    is24Hours: true
  },
  {
    id: 'mag-fire-service',
    name: 'মাগুরা ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Magura Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002239',
    districtId: 'magura',
    districtName: 'মাগুরা',
    description: 'মাগুরা ফায়ার সার্ভিস ও সিভিল ডিফেন্স।',
    is24Hours: true
  },

  // 9. NARAIL DISTRICT
  {
    id: 'nar-police-control',
    name: 'নড়াইল জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Narail Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374205',
    districtId: 'narail',
    districtName: 'নড়াইল',
    description: 'নড়াইল জেলা জরুরি পুলিশ সহায়তা।',
    is24Hours: true
  },
  {
    id: 'nar-fire-service',
    name: 'নড়াইল ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Narail Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002240',
    districtId: 'narail',
    districtName: 'নড়াইল',
    description: 'নড়াইল ফায়ার সার্ভিস ও দুর্ঘটনা উদ্ধার।',
    is24Hours: true
  },

  // 10. CHUADANGA DISTRICT
  {
    id: 'chu-police-control',
    name: 'চুয়াডাঙ্গা জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Chuadanga Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374222',
    districtId: 'chuadanga',
    districtName: 'চুয়াডাঙ্গা',
    description: 'চুয়াডাঙ্গা জেলা পুলিশ জরুরি সেবা।',
    is24Hours: true
  },
  {
    id: 'chu-fire-service',
    name: 'চুয়াডাঙ্গা ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Chuadanga Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002241',
    districtId: 'chuadanga',
    districtName: 'চুয়াডাঙ্গা',
    description: 'চুয়াডাঙ্গা ফায়ার সার্ভিস ও উদ্ধার সেবা।',
    is24Hours: true
  },

  // 11. MEHERPUR DISTRICT
  {
    id: 'meh-police-control',
    name: 'মেহেরপুর জেলা পুলিশ কন্ট্রোল রুম',
    nameEn: 'Meherpur Police Control Room',
    category: 'police',
    categoryLabel: 'পুলিশ প্রশাসন',
    phone: '01713-374239',
    districtId: 'meherpur',
    districtName: 'মেহেরপুর',
    description: 'মেহেরপুর জেলা ও মুজিবনগর সীমান্ত পুলিশ কন্ট্রোল।',
    is24Hours: true
  },
  {
    id: 'meh-fire-service',
    name: 'মেহেরপুর ফায়ার সার্ভিস স্টেশন',
    nameEn: 'Meherpur Fire Service Station',
    category: 'fire',
    categoryLabel: 'ফায়ার সার্ভিস',
    phone: '01730-002242',
    districtId: 'meherpur',
    districtName: 'মেহেরপুর',
    description: 'মেহেরপুর ফায়ার সার্ভিস স্টেশন।',
    is24Hours: true
  }
];

export const OFFLINE_EMERGENCY_CACHE_KEY = 'smart_khulna_offline_emergency_directory_v1';

export function getCachedOfflineEmergencies(): OfflineEmergencyItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_EMERGENCY_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }
  // Store default
  try {
    localStorage.setItem(OFFLINE_EMERGENCY_CACHE_KEY, JSON.stringify(offlineEmergencyDirectory));
  } catch (e) {}
  return offlineEmergencyDirectory;
}
