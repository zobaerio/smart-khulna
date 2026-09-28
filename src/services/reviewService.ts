import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  serverTimestamp, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
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

const LOCAL_STORAGE_REVIEWS_KEY = 'smart_khulna_service_reviews_v1';

/**
 * Get locally stored real reviews, filtering out legacy synthetic demo entries
 */
export function getLocalReviews(): ServiceReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Purge legacy auto-generated fake demo reviews (rev_gen_...)
        const cleaned = parsed.filter(
          r => r && !r.id?.startsWith('rev_gen_') && !r.userId?.startsWith('user_sample_gen_')
        );
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local reviews', e);
  }
  return [];
}

export function saveLocalReviews(reviews: ServiceReview[]): void {
  try {
    // Ensure no fake generated demo entries are saved
    const cleaned = reviews.filter(
      r => r && !r.id?.startsWith('rev_gen_') && !r.userId?.startsWith('user_sample_gen_')
    );
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(cleaned));
  } catch (e) {
    console.error('Failed to save reviews locally', e);
  }
}

/**
 * Fetch reviews for a specific service from Firestore and local cache.
 * Genuinely reflects real citizen reviews without fake user injection.
 */
export async function fetchServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  const localList = getLocalReviews();
  const localMatching = localList.filter(r => r.serviceId === serviceId);

  try {
    const q = query(
      collection(db, 'service_reviews'),
      where('serviceId', '==', serviceId),
      limit(100)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const remoteReviews: ServiceReview[] = snap.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          serviceId: d.serviceId,
          userId: d.userId || 'citizen_anon',
          userName: d.userName || 'নাগরিক',
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
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Update local storage cache with real entries
      const otherReviews = localList.filter(r => r.serviceId !== serviceId);
      saveLocalReviews([...otherReviews, ...combined]);

      return combined;
    }
  } catch (err) {
    console.warn('Firestore fetchServiceReviews offline fallback:', err);
  }

  return localMatching.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Fetch all service reviews across all categories and districts (for Admin Dashboard & Analytics)
 */
export async function fetchAllServiceReviews(): Promise<ServiceReview[]> {
  const localList = getLocalReviews();

  try {
    const q = query(
      collection(db, 'service_reviews'),
      limit(500)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const remoteReviews: ServiceReview[] = snap.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          serviceId: d.serviceId,
          userId: d.userId || 'citizen_anon',
          userName: d.userName || 'সম্মানিত নাগরিক',
          userAvatar: d.userAvatar || '',
          rating: Number(d.rating) || 5,
          comment: d.comment || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          createdAt: d.createdAt ? (d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          verifiedCitizen: !!d.verifiedCitizen
        };
      });

      const mergedMap = new Map<string, ServiceReview>();
      localList.forEach(r => mergedMap.set(r.id, r));
      remoteReviews.forEach(r => mergedMap.set(r.id, r));
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      saveLocalReviews(combined);
      return combined;
    }
  } catch (err) {
    console.warn('Firestore fetchAllServiceReviews fallback:', err);
  }

  return localList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Subscribe in real time to all service reviews for live admin panel updates
 */
export function subscribeAllServiceReviews(
  callback: (reviews: ServiceReview[]) => void
): () => void {
  try {
    const q = query(collection(db, 'service_reviews'), limit(500));
    return onSnapshot(q, (snap) => {
      const remoteReviews: ServiceReview[] = snap.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          serviceId: d.serviceId,
          userId: d.userId || 'citizen_anon',
          userName: d.userName || 'সম্মানিত নাগরিক',
          userAvatar: d.userAvatar || '',
          rating: Number(d.rating) || 5,
          comment: d.comment || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          createdAt: d.createdAt ? (d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          verifiedCitizen: !!d.verifiedCitizen
        };
      });

      const localList = getLocalReviews();
      const mergedMap = new Map<string, ServiceReview>();
      localList.forEach(r => mergedMap.set(r.id, r));
      remoteReviews.forEach(r => mergedMap.set(r.id, r));
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      saveLocalReviews(combined);
      callback(combined);
    }, (err) => {
      console.warn('subscribeAllServiceReviews snapshot error:', err);
      callback(getLocalReviews());
    });
  } catch (err) {
    console.warn('subscribeAllServiceReviews init error:', err);
    callback(getLocalReviews());
    return () => {};
  }
}

/**
 * Subscribe in real time to reviews of a specific service
 */
export function subscribeServiceReviews(
  serviceId: string,
  callback: (reviews: ServiceReview[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'service_reviews'),
      where('serviceId', '==', serviceId),
      limit(100)
    );
    return onSnapshot(q, (snap) => {
      const remoteReviews: ServiceReview[] = snap.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          serviceId: d.serviceId,
          userId: d.userId || 'citizen_anon',
          userName: d.userName || 'সম্মানিত নাগরিক',
          userAvatar: d.userAvatar || '',
          rating: Number(d.rating) || 5,
          comment: d.comment || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          createdAt: d.createdAt ? (d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt) : new Date().toISOString(),
          verifiedCitizen: !!d.verifiedCitizen
        };
      });

      const localList = getLocalReviews().filter(r => r.serviceId === serviceId);
      const mergedMap = new Map<string, ServiceReview>();
      localList.forEach(r => mergedMap.set(r.id, r));
      remoteReviews.forEach(r => mergedMap.set(r.id, r));
      const combined = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(combined);
    }, (err) => {
      console.warn('subscribeServiceReviews error:', err);
      callback(getLocalReviews().filter(r => r.serviceId === serviceId));
    });
  } catch (err) {
    console.warn('subscribeServiceReviews init error:', err);
    callback(getLocalReviews().filter(r => r.serviceId === serviceId));
    return () => {};
  }
}

/**
 * Submit a real citizen review and sync to Firestore and local cache
 */
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
  const fallbackId = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newReview: ServiceReview = {
    id: fallbackId,
    serviceId,
    userId: reviewData.userId,
    userName: reviewData.userName?.trim() || 'নাগরিক',
    userAvatar: reviewData.userAvatar,
    rating: Math.max(1, Math.min(5, reviewData.rating)),
    comment: reviewData.comment.trim(),
    tags: reviewData.tags || [],
    createdAt: new Date().toISOString(),
    verifiedCitizen: reviewData.verifiedCitizen
  };

  // Immediate local cache update (Offline First)
  const current = getLocalReviews();
  saveLocalReviews([newReview, ...current]);

  // Firestore remote persistence
  try {
    const docRef = await addDoc(collection(db, 'service_reviews'), {
      serviceId: newReview.serviceId,
      userId: newReview.userId,
      userName: newReview.userName,
      userAvatar: newReview.userAvatar || '',
      rating: newReview.rating,
      comment: newReview.comment,
      tags: newReview.tags,
      verifiedCitizen: !!newReview.verifiedCitizen,
      createdAt: newReview.createdAt,
      createdAtServer: serverTimestamp()
    });
    
    // Update local cache with permanent Firestore document ID
    const updatedWithDocId = { ...newReview, id: docRef.id };
    const reloaded = getLocalReviews().map(r => r.id === fallbackId ? updatedWithDocId : r);
    saveLocalReviews(reloaded);
    return updatedWithDocId;
  } catch (err) {
    console.warn('Review saved locally (will sync to cloud when online):', err);
  }

  return newReview;
}

/**
 * Delete a review (used by Admin moderation to remove spam or inappropriate feedback)
 */
export async function deleteServiceReview(reviewId: string): Promise<void> {
  const current = getLocalReviews().filter(r => r.id !== reviewId);
  saveLocalReviews(current);

  try {
    await deleteDoc(doc(db, 'service_reviews', reviewId));
  } catch (err) {
    console.warn('Firestore deleteServiceReview fallback:', err);
  }
}

/**
 * Compute statistical rating metrics for any list of reviews
 */
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
