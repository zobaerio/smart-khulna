import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  MessageCircle,
  UserPlus,
  Heart,
  MessageSquare,
  Share2,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { Icon } from '../ui/Icon';
import { CommunityNotification, NotificationType } from '../../types/community';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CommunityNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notification: CommunityNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  const renderIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_message':
        return <Icon icon={MessageCircle} size={18} className="text-emerald-600" interactive />;
      case 'new_follower':
        return <Icon icon={UserPlus} size={18} className="text-blue-600" interactive />;
      case 'post_like':
        return <Icon icon={Heart} size={18} className="text-rose-500" interactive />;
      case 'post_comment':
      case 'comment_reply':
        return <Icon icon={MessageSquare} size={18} className="text-amber-600" interactive />;
      case 'post_share':
        return <Icon icon={Share2} size={18} className="text-indigo-600" interactive />;
      case 'report_resolved':
        return <Icon icon={AlertCircle} size={18} className="text-emerald-700" interactive />;
      case 'admin_announcement':
      default:
        return <Icon icon={Megaphone} size={18} className="text-emerald-700" interactive />;
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center sm:justify-end p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-top-4 sm:slide-in-from-right-4 duration-200 mt-14 sm:mt-16 sm:mr-4">
        {/* HEADER */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Bell size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">বিজ্ঞপ্তি</h3>
              <p className="text-[10px] text-slate-500">আপনার সাম্প্রতিক আপডেট ও কার্যক্রম</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck size={13} /> পঠিত চিহ্নিত করুন
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <Bell size={28} className="mx-auto text-slate-300" />
              <p>নতুন কোনো বিজ্ঞপ্তি নেই।</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 ${
                  !notif.isRead ? 'bg-emerald-50/60' : ''
                }`}
              >
                <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200/80 flex-shrink-0">
                  {renderIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">{notif.message}</p>
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
