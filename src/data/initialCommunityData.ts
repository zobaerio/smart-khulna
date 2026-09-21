import { CommunityPost, Conversation, CommunityNotification, PublicUserProfile } from '../types/community';

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'user_khulna_admin',
    authorName: 'স্মার্ট খুলনা তথ্য সেবা',
    authorEmail: 'info@smartkhulna.gov.bd',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    authorDistrict: 'khulna',
    authorBadge: 'admin',
    type: 'local_info',
    title: 'রূপসা সেতু সংলগ্ন ট্রাফিক ও সৌন্দর্যবর্ধন নির্দেশনা',
    content: 'সম্মানিত খুলনা বিভাগবাসী, রূপসা খানজাহান আলী (র.) সেতু এবং আশেপাশের বাইপাস সড়কে সন্ধ্যায় ভ্রমণকারীদের সুবিধার্থে অতিরিক্ত সড়কবাতি ও সিসিটিভি ক্যামেরা স্থাপন সম্পন্ন হয়েছে। অনুগ্রহ করে সড়কে ময়লা ফেলা থেকে বিরত থাকুন এবং ট্রাফিক নিয়ম মেনে চলুন।',
    images: [
      {
        id: 'img_1_1',
        url: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=800&q=80',
        caption: 'রূপসা সেতু খুলনা'
      }
    ],
    districtId: 'khulna',
    upazilaId: 'রূপসা',
    categoryId: 'tourist_spots',
    locationName: 'রূপসা সেতু, খুলনা',
    hashtags: ['#SmartKhulna', '#RupshaBridge', '#KhulnaCity'],
    status: 'published',
    likesCount: 38,
    likedBy: [],
    savedBy: [],
    commentsCount: 3,
    sharesCount: 14,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isPinned: true
  },
  {
    id: 'post_2',
    authorId: 'user_bagerhat_heritage',
    authorName: 'তানভীর আহমেদ',
    authorEmail: 'tanvir.bagerhat@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    authorDistrict: 'bagerhat',
    authorBadge: 'verified_citizen',
    type: 'question',
    title: 'ষাট গম্বুজ মসজিদ সংলগ্ন সেরা পারিবারিক রেস্তোরাঁ কোনটি?',
    content: 'আসসালামু আলাইকুম। আগামী শুক্রবার ঢাকা থেকে আমাদের পরিবার বাগেরহাট বিশ্ব ঐতিহ্য ষাট গম্বুজ মসজিদ পরিদর্শনে আসবে। আশেপাশে পরিষ্কার এবং স্বাস্থ্যকর খাঁটি স্থানীয় খাবার পাওয়া যায় এমন কোনো ভালো হোটেলের সন্ধান দেবেন কি?',
    images: [
      {
        id: 'img_2_1',
        url: 'https://images.unsplash.com/photo-1626014303757-6ea640d57f84?w=800&q=80',
        caption: 'ঐতিহাসিক ষাট গম্বুজ মসজিদ'
      }
    ],
    districtId: 'bagerhat',
    upazilaId: 'বাগেরহাট সদর',
    categoryId: 'food_restaurants',
    locationName: 'ষাট গম্বুজ, বাগেরহাট',
    hashtags: ['#BagerhatHeritage', '#ShatGombuj', '#KhulnaFood'],
    status: 'published',
    likesCount: 22,
    likedBy: [],
    savedBy: [],
    commentsCount: 5,
    sharesCount: 6,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'post_3',
    authorId: 'user_jashore_benapole',
    authorName: 'মোস্তাফিজুর রহমান',
    authorEmail: 'mustafiz.jashore@yahoo.com',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    authorDistrict: 'jashore',
    authorBadge: 'verified_citizen',
    type: 'service_recommendation',
    title: 'যশোর আইটি পার্ক ও বেনাপোল এক্সপ্রেস ট্রেনের সময়সূচী আপডেট',
    content: 'শেখ হাসিনা সফটওয়্যার টেকনোলজি পার্ক যশোরের উদ্যোক্তাদের জন্য নতুন ফ্রিল্যান্সিং উইং চালু হয়েছে। পাশাপাশি বেনাপোল-ঢাকা এক্সপ্রেসের নতুন শিডিউল অনুযায়ী সপ্তাহে একদিন ব্যতীত নিয়মিত চলাচল করছে। তরুণ ডেভেলপারদের এই সুবিধা গ্রহণ করতে উৎসাহিত করছি।',
    images: [
      {
        id: 'img_3_1',
        url: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&q=80',
        caption: 'যশোর আইটি পার্ক'
      }
    ],
    districtId: 'jashore',
    upazilaId: 'যশোর সদর',
    categoryId: 'education',
    locationName: 'নাজির শংকরপুর, যশোর',
    hashtags: ['#JashoreITPark', '#SmartJashore', '#FreelanceKhulna'],
    status: 'published',
    likesCount: 45,
    likedBy: [],
    savedBy: [],
    commentsCount: 7,
    sharesCount: 19,
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString()
  },
  {
    id: 'post_4',
    authorId: 'user_satkhira_eco',
    authorName: 'সাদিয়া তাসনিম',
    authorEmail: 'sadia.satkhira@outlook.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    authorDistrict: 'satkhira',
    authorBadge: 'verified_citizen',
    type: 'local_info',
    title: 'সুন্দরবন সাতক্ষীরা রেঞ্জ: কলাগাছিয়া ও বুড়িগোয়ালিনী ইকো-ট্যুরিজম আপডেট',
    content: 'সুন্দরবন পশ্চিম বনবিভাগের সাতক্ষীরা রেঞ্জে এখন দর্শনার্থীদের আগমন বাড়ছে। খাঁটি সুন্দরবনের মধু ও সুন্দরবনের ট্রাভেলার পাসের জন্য বুড়িগোয়ালিনী ফরেস্ট স্টেশনে ডিজিটাল পাস সেবা চালু হয়েছে। পরিবেশ রক্ষায় প্লাস্টিক সামগ্রী বহন সম্পূর্ণ নিষিদ্ধ।',
    images: [
      {
        id: 'img_4_1',
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
        caption: 'সুন্দরবনের ট্রাভেল বোট'
      }
    ],
    districtId: 'satkhira',
    upazilaId: 'শ্যামনগর',
    categoryId: 'tourist_spots',
    locationName: 'কলাগাছিয়া ইকো ট্যুরিজম কেন্দ্র, সাতক্ষীরা',
    hashtags: ['#Sundarbans', '#SatkhiraTourism', '#EcoTravel'],
    status: 'published',
    likesCount: 56,
    likedBy: [],
    savedBy: [],
    commentsCount: 8,
    sharesCount: 27,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'post_5',
    authorId: 'user_kushtia_culture',
    authorName: 'হাসানুল হক',
    authorEmail: 'hasanul.kushtia@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    authorDistrict: 'kushtia',
    authorBadge: 'verified_citizen',
    type: 'general',
    title: 'ছেঁউড়িয়া লালন সাঁইজির আখড়াবাড়ির বার্ষিক স্মরণোৎসব প্রস্তুতি',
    content: 'বাউল সম্রাট ফকির লালন শাহের পূণ্যভূমি কুষ্টিয়ার ছেঁউড়িয়াতে আসন্ন স্মরণোৎসবের মঞ্চ ও আলোকসজ্জার কাজ পুরোদমে চলছে। দেশের নানা প্রান্ত থেকে সাধু ও ভক্তদের মিলনমেলা শুরু হতে যাচ্ছে। কুষ্টিয়া শহরের যেকোনো জরুরি প্রয়োজনে আমাদের স্বেচ্ছাসেবক দল প্রস্তুত রয়েছে।',
    images: [
      {
        id: 'img_5_1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        caption: 'কুষ্টিয়া লালন আখড়া চত্বর'
      }
    ],
    districtId: 'kushtia',
    upazilaId: 'কুমারখালী',
    categoryId: 'tourist_spots',
    locationName: 'ছেঁউড়িয়া, কুষ্টিয়া',
    hashtags: ['#LalonShah', '#KushtiaCulture', '#BaulMela'],
    status: 'published',
    likesCount: 64,
    likedBy: [],
    savedBy: [],
    commentsCount: 9,
    sharesCount: 31,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  }
];

export const initialCommunityComments = {
  post_1: [
    {
      id: 'comm_1',
      postId: 'post_1',
      authorId: 'user_bagerhat_heritage',
      authorName: 'তানভীর আহমেদ',
      authorEmail: 'tanvir.bagerhat@gmail.com',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      authorBadge: 'verified_citizen' as const,
      content: 'খুবই প্রশংসনীয় উদ্যোগ! রূপসা ব্রিজের বাতিগুলো সন্ধ্যা নামতেই শহরকে দারুণ রূপ দেয়।',
      createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      likesCount: 6,
      likedBy: [],
      replies: [
        {
          id: 'rep_1_1',
          commentId: 'comm_1',
          authorId: 'user_khulna_admin',
          authorName: 'স্মার্ট খুলনা তথ্য সেবা',
          authorEmail: 'info@smartkhulna.gov.bd',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
          authorBadge: 'admin' as const,
          content: 'ধন্যবাদ তানভীর ভাই। সার্বক্ষণিক নিরাপত্তা নিশ্চিত করতে টহল পুলিশও নিয়োজিত রয়েছে।',
          createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
          likesCount: 4,
          likedBy: []
        }
      ]
    },
    {
      id: 'comm_2',
      postId: 'post_1',
      authorId: 'user_jashore_benapole',
      authorName: 'মোস্তাফিজুর রহমান',
      authorEmail: 'mustafiz.jashore@yahoo.com',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      authorBadge: 'verified_citizen' as const,
      content: 'ব্রিজের টোল প্লাজার পাশে ট্রাফিক নিয়ন্ত্রণ আরো একটু গতিশীল হলে পিক আওয়ারে যানজট কমতো।',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      likesCount: 3,
      likedBy: [],
      replies: []
    }
  ],
  post_2: [
    {
      id: 'comm_3',
      postId: 'post_2',
      authorId: 'user_khulna_admin',
      authorName: 'স্মার্ট খুলনা তথ্য সেবা',
      authorEmail: 'info@smartkhulna.gov.bd',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      authorBadge: 'admin' as const,
      content: 'ষাট গম্বুজ জাদুঘরের বিপরীতে খুলনা-বাগেরহাট হাইওয়ে সংলগ্ন হেরিটেজ রেস্তোরাঁ ও সুন্দরবন ফুড কর্নার বেশ পরিচ্ছন্ন ও জনপ্রিয়।',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      likesCount: 8,
      likedBy: [],
      replies: []
    }
  ]
};

export const initialSampleUsers: PublicUserProfile[] = [
  {
    uid: 'user_khulna_admin',
    name: 'স্মার্ট খুলনা তথ্য সেবা (Admin)',
    email: 'zobaerhasan431@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    bio: 'স্মার্ট খুলনা ডিজিটাল নাগরিক সেবা ও কমিউনিটি তথ্য সমন্বয়কারী। খুলনা বিভাগের ১০ জেলার নাগরিক সেবা দ্রুত পৌঁছে দেওয়াই আমাদের লক্ষ্য।',
    district: 'khulna',
    joinedDate: 'জানুয়ারি ২০২৪',
    badge: 'admin',
    postsCount: 42,
    followersCount: 528,
    followingCount: 15,
    isOnline: true
  },
  {
    uid: 'user_bagerhat_heritage',
    name: 'তানভীর আহমেদ',
    email: 'tanvir.bagerhat@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    bio: 'বাগেরহাটের স্থানীয় গাইড ও প্রত্নতাত্ত্বিক ঐতিহ্য অনুরাগী। ষাট গম্বুজ ও সুন্দরবনের সৌন্দর্য প্রচারে নিবেদিত।',
    district: 'bagerhat',
    joinedDate: 'মার্চ ২০২৪',
    badge: 'verified_citizen',
    postsCount: 18,
    followersCount: 142,
    followingCount: 39,
    isOnline: true
  },
  {
    uid: 'user_jashore_benapole',
    name: 'মোস্তাফিজুর রহমান',
    email: 'mustafiz.jashore@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    bio: 'যশোরের আইটি পেশাজীবী ও টেক উদ্যোক্তা। যশোর আইটি পার্কের কমিউনিটি সংগঠক।',
    district: 'jashore',
    joinedDate: 'ফেব্রুয়ারি ২০২৪',
    badge: 'verified_citizen',
    postsCount: 29,
    followersCount: 210,
    followingCount: 45,
    isOnline: false
  },
  {
    uid: 'user_satkhira_eco',
    name: 'সাদিয়া তাসনিম',
    email: 'sadia.satkhira@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    bio: 'সাতক্ষীরা সুন্দরবন ইকোট্যুরিজম ও সামাজিক গবেষক। উপকূলীয় দুর্যোগ ব্যবস্থাপনা কর্মী।',
    district: 'satkhira',
    joinedDate: 'এপ্রিল ২০২৪',
    badge: 'verified_citizen',
    postsCount: 15,
    followersCount: 185,
    followingCount: 62,
    isOnline: true
  }
];

export const initialSampleConversations: Conversation[] = [
  {
    id: 'conv_admin_support',
    participantIds: ['user_khulna_admin', 'current_user_placeholder'],
    participants: {
      user_khulna_admin: {
        uid: 'user_khulna_admin',
        name: 'স্মার্ট খুলনা হেল্পডেস্ক',
        email: 'support@smartkhulna.gov.bd',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        district: 'khulna',
        badge: 'admin',
        isOnline: true
      },
      current_user_placeholder: {
        uid: 'current_user_placeholder',
        name: 'আমার অ্যাকাউন্ট',
        email: 'user@example.com',
        district: 'khulna',
        isOnline: true
      }
    },
    lastMessage: {
      text: 'স্বাগতম স্মার্ট খুলনা কমিউনিটিতে! যেকোনো তথ্য বা জরুরি সেবায় আমাদের সরাসরি মেসেজ পাঠাতে পারেন।',
      senderId: 'user_khulna_admin',
      senderName: 'স্মার্ট খুলনা হেল্পডেস্ক',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      isRead: false
    },
    unreadCounts: {
      current_user_placeholder: 1,
      user_khulna_admin: 0
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

export const initialSampleNotifications: CommunityNotification[] = [
  {
    id: 'notif_1',
    recipientUid: 'current_user_placeholder',
    actorUid: 'user_khulna_admin',
    actorName: 'স্মার্ট খুলনা টিম',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    type: 'admin_announcement',
    title: 'কমিউনিটি ও মেসেজিং সিস্টেমে স্বাগতম',
    message: 'স্মার্ট খুলনা সোশ্যাল ফিড এবং প্রাইভেট মেসেজিং প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার জেলার তথ্য শেয়ার করুন।',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'notif_2',
    recipientUid: 'current_user_placeholder',
    actorUid: 'user_bagerhat_heritage',
    actorName: 'তানভীর আহমেদ',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    type: 'new_follower',
    title: 'নতুন ফলোয়ার',
    message: 'তানভীর আহমেদ আপনাকে ফলো করা শুরু করেছেন।',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];
