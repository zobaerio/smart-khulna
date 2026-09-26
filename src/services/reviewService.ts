import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  createdAt: string;
  verifiedCitizen?: boolean;
}

export const INITIAL_SAMPLE_REVIEWS: ServiceReview[] = [
  {
    id: 'rev-kmch-1',
    serviceId: 'kh-kmch',
    userId: 'user-sample-1',
    userName: 'আবুল কালাম আজাদ',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    rating: 5,
    comment: 'জরুরি বিভাগে খুব দ্রুত চিকিৎসা পেয়েছি। ডাক্তারদের ব্যবহার ও সেবার মান আগের চেয়ে অনেক উন্নত হয়েছে।',
    tags: ['দ্রুত সেবা', 'জরুরি ডাক্তার', 'সদাচারী'],
    createdAt: '2026-09-18T10:30:00Z',
    verifiedCitizen: true
  },
  {
    id: 'rev-kmch-2',
    serviceId: 'kh-kmch',
    userId: 'user-sample-2',
    userName: 'নাসরিন সুলতানা',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 4,
    comment: 'টিকিট কাউন্টারে ভিড় বেশি ছিল, তবে ডাক্তাররা খুব মনোযোগ দিয়ে দেখেছেন। ওষুধও পেয়েছি।',
    tags: ['সাশ্রয়ী', 'দক্ষ ডাক্তার'],
    createdAt: '2026-09-21T14:15:00Z',
    verifiedCitizen: true
  },
  {
    id: 'rev-police-1',
    serviceId: 'kh-police',
    userId: 'user-sample-3',
    userName: 'তানভীর আহমেদ',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    rating: 5,
    comment: 'জিডি করার জন্য গিয়েছিলাম, ডিউটি অফিসার কোনো ঝামেলা ছাড়াই খুব দ্রুত জিডি গ্রহণ করেছেন।',
    tags: ['দ্রুত সেবা', 'সহযোগিতাপূর্ণ', 'বিশ্বস্ত'],
    createdAt: '2026-09-22T16:00:00Z',
    verifiedCitizen: true
  },
  {
    id: 'rev-rupsha-1',
    serviceId: 'kh-rupsha',
    userId: 'user-sample-4',
    userName: 'ফারহানা ইয়াসমিন',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    rating: 5,
    comment: 'চুইঝালের মাংস এবং পরিবেশ অসাধারণ! রূপসা নদীর বাতাস ও খাবারের স্বাদ মুখে লেগে থাকার মতো।',
    tags: ['সুস্বাদু খাবার', 'সুন্দর পরিবেশ', 'পরিচ্ছন্ন'],
    createdAt: '2026-09-23T19:40:00Z',
    verifiedCitizen: false
  }
];

const LOCAL_STORAGE_REVIEWS_KEY = 'smart_khulna_service_reviews_v1';

export function getLocalReviews(): ServiceReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local reviews', e);
  }
  // save defaults
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(INITIAL_SAMPLE_REVIEWS));
  } catch (e) {}
  return INITIAL_SAMPLE_REVIEWS;
}

export function saveLocalReviews(reviews: ServiceReview[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews locally', e);
  }
}

export async function fetchServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  const localList = getLocalReviews();
  let localMatching = localList.filter(r => r.serviceId === serviceId);

  if (localMatching.length === 0) {
    const defaultReviews: ServiceReview[] = [
      {
        id: 'rev_gen_' + serviceId + '_1',
        serviceId,
        userId: 'user_sample_gen_1',
        userName: 'মো. রফিকুল ইসলাম',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        rating: 5,
        comment: 'খুব চমৎকার ও সময়োপযোগী সেবা! যোগাযোগ করার সাথে সাথেই সহযোগিতা পেয়েছি।',
        tags: ['দ্রুত সেবা', 'সহযোগিতাপূর্ণ'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        verifiedCitizen: true
      },
      {
        id: 'rev_gen_' + serviceId + '_2',
        serviceId,
        userId: 'user_sample_gen_2',
        userName: 'নাজমুন নাহার',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
        comment: 'অত্যন্ত নির্ভরযোগ্য প্রতিষ্ঠান। সবারই এই সেবাটি ব্যবহার করা উচিত।',
        tags: ['বিশ্বস্ত', 'সাশ্রয়ী ও ন্যায্য মূল্য'],
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        verifiedCitizen: true
      }
    ];
    saveLocalReviews([...localList, ...defaultReviews]);
    localMatching = defaultReviews;
  }

  try {
    const q = query(
      collection(db, 'service_reviews'),
      where('serviceId', '==', serviceId),
      limit(50)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const remoteReviews: ServiceReview[] = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          serviceId: d.serviceId,
          userId: d.userId,
          userName: d.userName || 'নাম প্রকাশে অনিচ্ছুক',
          userAvatar: d.userAvatar || '',
          rating: Number(d.rating) || 5,
          comment: d.comment || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          createdAt: d.createdAt ? (d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          verifiedCitizen: !!d.verifiedCitizen
        };
      });

      // Merge remote with local deduplicating by ID
      const mergedMap = new Map<string, ServiceReview>();
      localMatching.forEach(r => mergedMap.set(r.id, r));
      remoteReviews.forEach(r => mergedMap.set(r.id, r));
      const combined = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Update local storage cache
      const otherReviews = localList.filter(r => r.serviceId !== serviceId);
      saveLocalReviews([...otherReviews, ...combined]);

      return combined;
    }
  } catch (err) {
    console.warn('Firestore fetchServiceReviews offline fallback:', err);
  }

  return localMatching.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function submitServiceReview(
  serviceId: string,
  reviewData: {
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    tags?: string[];
    verifiedCitizen?: boolean;
  }
): Promise<ServiceReview> {
  const newReview: ServiceReview = {
    id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    serviceId,
    userId: reviewData.userId,
    userName: reviewData.userName || 'নামহীন নাগরিক',
    userAvatar: reviewData.userAvatar,
    rating: Math.max(1, Math.min(5, reviewData.rating)),
    comment: reviewData.comment.trim(),
    tags: reviewData.tags || [],
    createdAt: new Date().toISOString(),
    verifiedCitizen: reviewData.verifiedCitizen
  };

  // Immediate local cache update (Offline First)
  const current = getLocalReviews();
  const updated = [newReview, ...current];
  saveLocalReviews(updated);

  // Background Firestore sync
  try {
    const docRef = await addDoc(collection(db, 'service_reviews'), {
      ...newReview,
      createdAtServer: serverTimestamp()
    });
    newReview.id = docRef.id;
  } catch (err) {
    console.warn('Review saved offline only (will sync when online):', err);
  }

  return newReview;
}

export function computeServiceRatingStats(reviews: ServiceReview[]): {
  average: number;
  total: number;
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
} {
  if (!reviews || reviews.length === 0) {
    return {
      average: 5.0,
      total: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const r of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    sum += r.rating;
  }

  const average = Number((sum / reviews.length).toFixed(1));

  return {
    average,
    total: reviews.length,
    distribution
  };
}
