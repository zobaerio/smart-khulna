// SMART KHULNA COMMUNITY & MESSAGING TYPES

export type PostType = 'general' | 'question' | 'local_info' | 'service_recommendation' | 'location_based' | 'personal_blog';

export type VerifiedBadgeType = 'none' | 'govt_official' | 'emergency_service' | 'hospital' | 'admin' | 'verified_citizen';

export interface PostImage {
  id: string;
  url: string;
  caption?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorBadge?: VerifiedBadgeType;
  content: string;
  createdAt: string;
  likesCount: number;
  likedBy: string[]; // user UIDs
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorBadge?: VerifiedBadgeType;
  content: string;
  createdAt: string;
  likesCount: number;
  likedBy: string[]; // user UIDs
  replies: CommentReply[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorDistrict?: string;
  authorBadge?: VerifiedBadgeType;
  title?: string;
  content: string;
  type: PostType;
  images: PostImage[];
  districtId?: string; // all 10 Khulna division districts
  upazilaId?: string;
  categoryId?: string;
  locationName?: string;
  hashtags?: string[];
  mentions?: string[];
  status: 'published' | 'draft' | 'hidden' | 'reported' | 'removed';
  likesCount: number;
  likedBy: string[]; // UIDs
  savedBy: string[]; // UIDs
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  createdAtMillis?: number;
  editedAt?: string;
  isEdited?: boolean;
  updatedAt?: string;
  isPinned?: boolean;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: string;
  storageProvider?: 'supabase' | 'local';
  storagePath?: string;
  width?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  text: string;
  attachments?: MessageAttachment[];
  createdAt: string;
  createdAtMillis?: number;
  editedAt?: string;
  isEdited?: boolean;
  isRead: boolean;
  readAt?: string;
  deletedForSender?: boolean;
}

export interface ConversationParticipant {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  district?: string;
  badge?: VerifiedBadgeType;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // [uidA, uidB]
  participants: { [uid: string]: ConversationParticipant };
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCounts: { [uid: string]: number };
  createdAt: string;
  updatedAt: string;
  hiddenForUserIds?: string[]; // user deleted conversation from their view
}

export type ReportTargetType = 'post' | 'comment' | 'user' | 'message' | 'report';

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'fake_info'
  | 'offensive'
  | 'scam'
  | 'inappropriate'
  | 'impersonation'
  | 'hate_speech'
  | 'misinformation'
  | 'violence'
  | 'other';

export interface CommunityReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetContentSnippet?: string;
  targetAuthorId?: string;
  targetAuthorName?: string;
  targetDistrictId?: string;
  targetCategoryId?: string;
  reportedByUid: string;
  reportedByName: string;
  reportedByEmail: string;
  reason: ReportReason;
  customDetails?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  resolvedByAdmin?: string;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type NotificationType =
  | 'new_message'
  | 'new_follower'
  | 'post_like'
  | 'post_comment'
  | 'comment_reply'
  | 'post_share'
  | 'report_resolved'
  | 'admin_announcement';

export interface CommunityNotification {
  id: string;
  recipientUid: string;
  actorUid: string;
  actorName: string;
  actorAvatar?: string;
  type: NotificationType;
  title: string;
  message: string;
  targetId?: string; // postId or conversationId
  targetType?: 'post' | 'conversation' | 'profile';
  isRead: boolean;
  createdAt: string;
}

export interface UserFollow {
  id: string;
  followerUid: string;
  followingUid: string;
  createdAt: string;
}

export interface UserBlock {
  id: string;
  blockingUid: string;
  blockedUid: string;
  createdAt: string;
}

export interface PublicUserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  phone?: string;
  profession?: string;
  bloodGroup?: string;
  district?: string;
  upazila?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  joinedDate: string;
  badge?: VerifiedBadgeType;
  isBanned?: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isBlocked?: boolean;
  isOnline?: boolean;
  isLocked?: boolean;
  showActiveStatus?: boolean;
}

export interface ModerationAction {
  id: string;
  adminEmail: string;
  adminRole: 'super_admin' | 'sub_admin';
  actionType: 'hide_post' | 'remove_post' | 'restore_post' | 'remove_comment' | 'suspend_user' | 'ban_user' | 'resolve_report' | 'dismiss_report';
  targetType: ReportTargetType;
  targetId: string;
  targetDistrictId?: string;
  reason: string;
  timestamp: string;
}
