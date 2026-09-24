import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Building2,
  Navigation,
  CloudRain,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Flame,
  Volume2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { 
  UserNotificationItem, 
  NotificationCategory, 
  NOTIFICATION_CATEGORIES 
} from '../../types/notifications';
import { 
  notificationService, 
  getLocalNotifications, 
  saveLocalNotifications,
  DEFAULT_NOTIFICATIONS 
} from '../../services/notificationService';
import { db, auth } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

interface NotificationCenterViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateDeepLink: (link?: string) => void;
  onOpenAdminBroadcast?: () => void;
  isAdmin?: boolean;
  currentUser?: any;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  isOpen,
  onClose,
  onNavigateDeepLink,
  onOpenAdminBroadcast,
  isAdmin = false,
  currentUser
}) => {
  const [notifications, setNotifications] = useState<UserNotificationItem[]>(() => {
    const local = getLocalNotifications();
    return local.length > 0 ? local : DEFAULT_NOTIFICATIONS;
  });
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fid, setFid] = useState<string>('লোড হচ্ছে...');
  const [fcmToken, setFcmToken] = useState<string>('');
  const [copiedFid, setCopiedFid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [permissionState, setPermissionState] = useState<string>('default');

  // Load FID, tokens, and subscribe to real-time updates
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }

    notificationService.getInstallationId().then(id => {
      setFid(id);
    });

    const token = notificationService.getCachedToken();
    if (token) setFcmToken(token);

    // Real-time Firestore sync
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(
          collection(db, 'user_notifications', user.uid, 'items'),
          orderBy('createdAtMillis', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserNotificationItem));
            setNotifications(items);
            saveLocalNotifications(items);
          }
        }, (err) => {
          console.warn('User notifications Firestore listener:', err);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Real-time listener setup fallback:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await notificationService.requestNotificationPermission();
    if (res.granted) {
      setPermissionState('granted');
      if (res.token) setFcmToken(res.token);
    }
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveLocalNotifications(updated);

    const user = auth.currentUser;
    if (user) {
      notifications.forEach(n => {
        if (!n.isRead) {
          notificationService.markAsOpened(n.notificationId, n.id);
        }
      });
    }
  };

  const handleSelectNotification = (item: UserNotificationItem) => {
    notificationService.markAsOpened(item.notificationId, item.id);
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    onClose();
    if (item.deepLink) {
      onNavigateDeepLink(item.deepLink);
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveLocalNotifications(updated);

    const user = auth.currentUser;
    if (user) {
      try {
        deleteDoc(doc(db, 'user_notifications', user.uid, 'items', id)).catch(() => {});
      } catch {}
    }
  };

  const handleSendTestNotification = () => {
    const testItem: UserNotificationItem = {
      id: 'test_' + Date.now(),
      notificationId: 'test_notif_' + Date.now(),
      title: 'টেস্ট পুশ নোটিফিকেশন ভেরিফাইড!',
      body: 'স্মার্ট খুলনার রিয়েল-টাইম নোটিফিকেশন সিস্টেম সফলভাবে সক্রিয় আছে। সাউন্ড, ভাইব্রেশন ও লাইভ ব্যাজ টেস্ট সফল।',
      category: 'notice',
      priority: 'high',
      deepLink: '/services',
      createdAt: new Date().toISOString(),
      createdAtMillis: Date.now(),
      isRead: false,
      receivedAt: new Date().toISOString()
    };
    notificationService.handleIncomingNotification(testItem);
    setNotifications(prev => [testItem, ...prev]);
  };

  const copyToClipboard = (text: string, type: 'fid' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'fid') {
      setCopiedFid(true);
      setTimeout(() => setCopiedFid(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'emergency':
        return <ShieldAlert size={16} className="text-red-600" />;
      case 'event':
        return <Calendar size={16} className="text-purple-600" />;
      case 'complaint':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'service':
        return <Building2 size={16} className="text-emerald-600" />;
      case 'traffic':
        return <Navigation size={16} className="text-yellow-600" />;
      case 'weather':
        return <CloudRain size={16} className="text-cyan-600" />;
      case 'notice':
      default:
        return <Bell size={16} className="text-blue-600" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMin / 60);
      if (diffMin < 2) return 'এইমাত্র';
      if (diffMin < 60) return `${diffMin} মিনিট আগে`;
      if (diffHrs < 24) return `${diffHrs} ঘণ্টা আগে`;
      return `${Math.floor(diffHrs / 24)} দিন আগে`;
    } catch {
      return '';
    }
  };

  // Filtered items
  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'unread' && item.isRead) return false;
    if (activeFilter !== 'all' && activeFilter !== 'unread' && item.category !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center sm:justify-end p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] mt-12 sm:mt-14 sm:mr-4 animate-in slide-in-from-top-4 sm:slide-in-from-right-4 duration-200">
        
        {/* TOP HEADER */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/80 via-white to-lime-50/50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif">
                  স্মার্ট খুলনা নোটিফিকেশন হাব
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    {unreadCount} নতুন
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                FCM পুশ, ইন-অ্যাপ মেসেজিং ও রিয়েল-টাইম নাগরিক সতর্কতা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdmin && onOpenAdminBroadcast && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminBroadcast();
                }}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition"
                title="ব্রডকাস্ট তৈরি করুন"
              >
                <Sparkles size={12} />
                ব্রডকাস্ট
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PERMISSION STATUS / BANNER */}
        {permissionState !== 'granted' && (
          <div className="bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Smartphone size={15} className="text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-900 dark:text-amber-200 font-bold leading-tight">
                তাত্ক্ষণিক নোটিফিকেশন পেতে অনুমতি দিন
              </p>
            </div>
            <button
              onClick={handleRequestPermission}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg shrink-0 cursor-pointer shadow-xs transition"
            >
              অনুমতি দিন
            </button>
          </div>
        )}

        {/* CATEGORY FILTER PILLS & SEARCH */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 space-y-2">
          {/* Quick Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="বিজ্ঞপ্তি খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Filter Badges Horizontal Scroll */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              সব ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeFilter === 'unread'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              অপঠিত ({unreadCount})
            </button>
            {Object.values(NOTIFICATION_CATEGORIES).map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0 ${
                  activeFilter === cat.id
                    ? `${cat.badgeBg} ${cat.badgeText} ring-1 ring-emerald-500 shadow-xs`
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Bell size={26} />
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">কোনো নোটিফিকেশন পাওয়া যায়নি</p>
                <p className="text-[11px] mt-0.5">নতুন কোনো বিজ্ঞপ্তি বা সতর্কতা আসলে এখানে দেখা যাবে।</p>
              </div>
              <button
                onClick={handleSendTestNotification}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-xs border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
              >
                <Sparkles size={13} /> টেস্ট নোটিফিকেশন পাঠান
              </button>
            </div>
          ) : (
            filteredNotifications.map(item => {
              const catConfig = NOTIFICATION_CATEGORIES[item.category] || NOTIFICATION_CATEGORIES.notice;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectNotification(item)}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 transition cursor-pointer group ${
                    !item.isRead 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {/* Category Icon Badge */}
                  <div className={`p-2.5 rounded-2xl shadow-2xs border shrink-0 mt-0.5 ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.borderColor}`}>
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${catConfig.badgeBg} ${catConfig.badgeText}`}>
                          {catConfig.label}
                        </span>
                        {item.priority === 'high' && (
                          <span className="text-[9px] font-extrabold text-red-600 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded">
                            জরুরি
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>

                    <h4 className={`text-xs leading-snug font-bold ${
                      !item.isRead ? 'text-slate-950 dark:text-white font-extrabold' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {item.body}
                    </p>

                    {item.image && (
                      <img
                        src={item.image}
                        alt="Notification Media"
                        className="mt-2 w-full h-28 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                      />
                    )}

                    {item.deepLink && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                        <span>সরাসরি দেখুন</span>
                        <ArrowRight size={11} />
                      </div>
                    )}
                  </div>

                  {/* Action delete & unread dot */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900" />
                    )}
                    <button
                      onClick={(e) => handleDeleteNotification(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded-md transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck size={14} /> সব পঠিত চিহ্নিত করুন
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <button
              onClick={() => setShowTestPanel(prev => !prev)}
              className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-500" /> টেস্ট ও FID
            </button>
          </div>

          <button
            onClick={handleSendTestNotification}
            className="text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            <Volume2 size={12} /> টেস্ট নোটিফিকেশন
          </button>
        </div>

        {/* TEST MODE & FIREBASE INSTALLATION ID (FID) CARD */}
        {showTestPanel && (
          <div className="p-4 bg-slate-900 text-slate-200 border-t border-slate-800 space-y-3 animate-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-amber-400" />
                <h4 className="text-xs font-bold text-white">Firebase Test Device & FID কন্ট্রোল</h4>
              </div>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                লাইভ মোড
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Firebase Console → Messaging → In-App Messaging → <strong className="text-white">Test Device</strong> এ টেস্ট করতে নিচের FID ব্যবহার করুন।
            </p>

            {/* FID Display */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-slate-400">Firebase Installation ID (FID)</span>
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <code className="text-[11px] text-amber-300 font-mono flex-1 truncate select-all">{fid}</code>
                <button
                  onClick={() => copyToClipboard(fid, 'fid')}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition cursor-pointer flex items-center gap-1 text-[10px] shrink-0"
                >
                  {copiedFid ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copiedFid ? 'কপি হয়েছে' : 'কপি FID'}
                </button>
              </div>
            </div>

            {/* FCM Token Display */}
            {fcmToken && (
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase text-slate-400">FCM Registration Token</span>
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <code className="text-[10px] text-emerald-300 font-mono flex-1 truncate select-all">{fcmToken}</code>
                  <button
                    onClick={() => copyToClipboard(fcmToken, 'token')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition cursor-pointer flex items-center gap-1 text-[10px] shrink-0"
                  >
                    {copiedToken ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedToken ? 'কপি হয়েছে' : 'কপি টোকেন'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
