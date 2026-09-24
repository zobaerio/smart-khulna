// SMART KHULNA - PRODUCTION FIREBASE NOTIFICATION SYSTEM TYPES

export type NotificationCategory =
  | 'notice'      // Blue
  | 'emergency'   // Red
  | 'event'       // Purple
  | 'complaint'   // Orange
  | 'service'     // Green
  | 'traffic'     // Yellow
  | 'weather';    // Cyan

export type NotificationPriority = 'high' | 'medium' | 'low';

export type NotificationTargetTopic =
  | 'all_users'
  | 'users'
  | 'moderators'
  | 'admins'
  | 'ward_wise'
  | 'selected_users'
  | 'custom';

export type EmergencyType = 'fire' | 'flood' | 'road' | 'electricity' | 'water' | 'general';

export interface DeliveryStats {
  sent: number;
  delivered: number;
  opened: number;
  failed: number;
  clickRate: number; // percentage
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  image?: string;
  topic: string; // e.g. 'all_users', 'ward_05', etc.
  target: NotificationTargetTopic;
  targetWard?: string; // e.g. '05'
  targetUserIds?: string[];
  deepLink?: string; // e.g. '/emergency', '/services', '/blood-bank', '/complaints'
  priority: NotificationPriority;
  category: NotificationCategory;
  emergencyType?: EmergencyType;
  createdAt: string;
  createdAtMillis: number;
  createdBy: {
    uid: string;
    name: string;
    email: string;
    role: string;
  };
  scheduledFor?: string | null;
  status: 'sent' | 'scheduled' | 'draft' | 'cancelled';
  deliveryStats: DeliveryStats;
}

export interface UserNotificationItem {
  id: string;
  notificationId: string;
  title: string;
  body: string;
  image?: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  deepLink?: string;
  emergencyType?: EmergencyType;
  createdAt: string;
  createdAtMillis: number;
  isRead: boolean;
  openedAt?: string;
  receivedAt?: string;
}

export interface FCMTokenRecord {
  token: string;
  uid: string;
  email?: string;
  role: string;
  ward?: string;
  platform: 'web' | 'android' | 'ios' | 'pwa' | 'desktop';
  userAgent?: string;
  lastSeen: string;
  createdAt: string;
}

export interface InAppCampaign {
  id: string;
  title: string;
  body: string;
  image?: string;
  illustrationType?: 'announcement' | 'emergency' | 'update' | 'citizen' | 'award';
  actionText: string;
  deepLink: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface NotificationCategoryConfig {
  id: NotificationCategory;
  label: string;
  labelEn: string;
  colorName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  iconName: string;
  hexColor: string;
}

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, NotificationCategoryConfig> = {
  notice: {
    id: 'notice',
    label: 'সাধারণ বিজ্ঞপ্তি',
    labelEn: 'Notice',
    colorName: 'blue',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconName: 'Bell',
    hexColor: '#2563eb',
  },
  emergency: {
    id: 'emergency',
    label: 'জরুরি সতর্কতা',
    labelEn: 'Emergency',
    colorName: 'red',
    badgeBg: 'bg-red-50 dark:bg-red-950/60',
    badgeText: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-300 dark:border-red-800',
    iconName: 'ShieldAlert',
    hexColor: '#dc2626',
  },
  event: {
    id: 'event',
    label: 'ইভেন্ট ও সভা',
    labelEn: 'Event',
    colorName: 'purple',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconName: 'Calendar',
    hexColor: '#9333ea',
  },
  complaint: {
    id: 'complaint',
    label: 'অভিযোগ ও সমাধান',
    labelEn: 'Complaint',
    colorName: 'orange',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconName: 'AlertTriangle',
    hexColor: '#ea580c',
  },
  service: {
    id: 'service',
    label: 'নাগরিক সেবা আপডেট',
    labelEn: 'Service',
    colorName: 'green',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconName: 'Building2',
    hexColor: '#059669',
  },
  traffic: {
    id: 'traffic',
    label: 'ট্রাফিক ও সড়ক নির্দেশিকা',
    labelEn: 'Traffic',
    colorName: 'yellow',
    badgeBg: 'bg-yellow-50 dark:bg-yellow-950/60',
    badgeText: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    iconName: 'Navigation',
    hexColor: '#ca8a04',
  },
  weather: {
    id: 'weather',
    label: 'আবহাওয়া ও জোয়ার-ভাটা',
    labelEn: 'Weather',
    colorName: 'cyan',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    iconName: 'CloudRain',
    hexColor: '#0891b2',
  },
};
