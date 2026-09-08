import React from 'react';
import {
  X,
  Bell,
  CheckCircle,
  Calendar,
  MessageSquareHeart,
  Smile,
  Sparkles,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'bridge':
      return <MessageSquareHeart className="w-4 h-4 text-purple-600" />;
    case 'calendar':
      return <Calendar className="w-4 h-4 text-indigo-600" />;
    case 'challenge':
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    case 'mood':
      return <Smile className="w-4 h-4 text-amber-600" />;
    default:
      return <Sparkles className="w-4 h-4 text-purple-600" />;
  }
};

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-purple-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">Family Notifications</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {notifications.filter((n) => !n.read).length} unread alerts
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-purple-700 font-semibold hover:text-purple-900"
          >
            Mark all as read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  n.read
                    ? 'border-slate-100 bg-white hover:bg-slate-50 opacity-80'
                    : 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
