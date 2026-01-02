import { useState, useRef, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Notification } from '../types';

import { useAppSelector } from '@/redux/hooks';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notification,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    const link = notification.metadata?.link;
    if (typeof link === 'string') {
      const separator = link.includes('?') ? '&' : '?';
      navigate(`${link}${separator}notificationId=${notification._id}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    'p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3',
                    !notification.isRead ? 'bg-blue-50/30' : '',
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      notification.type?.includes('mentor_application')
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600',
                    )}
                  >
                    {notification.type?.includes('mentor_application') ? (
                      <User size={16} />
                    ) : (
                      <Bell size={16} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm text-gray-800 leading-snug',
                        !notification.isRead && 'font-medium',
                      )}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {typeof notification.metadata?.link === 'string' && (
                    <div className="flex items-center">
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50">
                        View
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
