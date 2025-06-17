"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Filter,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import "@/public/assets/css/tailwind-cdn.css";
import Layout from "@/components/layout/Layout";

// Supabase auth hook
const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setToken(session?.access_token || null);
        setUserId(session?.user?.id || null);
        console.log(userId)
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return {
    token,
    userId,
    isAuthenticated: !!token && !!userId,
    loading,
  };
};

// API service for notifications using axios
const notificationService = {
  async fetchNotifications(userId, options = {}) {
    const params = new URLSearchParams();
    params.append("userId", userId);
    if (options.page) params.append("page", options.page);
    if (options.limit) params.append("limit", options.limit);
    
    try {
      const response = await axios.get(`/api/notification/get?${params}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `HTTP ${error.response.status}: ${
            error.response.data?.error || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error("Network error: Unable to reach server");
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  async markAsRead(notificationIds, userId) {
    try {
      const response = await axios.post("/api/notification/mark-read", {
        notificationIds,
        userId,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `HTTP ${error.response.status}: ${
            error.response.data?.error || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error("Network error: Unable to reach server");
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },
};

// Individual notification item component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onSelect,
  isSelected,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      info: "💡",
      warning: "⚠️",
      success: "✅",
      error: "❌",
      system: "⚙️",
      default: "📢",
    };
    return iconMap[type] || iconMap.default;
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 ${
        !notification.is_read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      } ${isSelected ? "bg-blue-100" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(notification.id)}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />

          <div className="text-2xl">
            {getNotificationIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4
                className={`text-sm font-medium ${
                  !notification.is_read ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.title}
              </h4>
              {notification.is_global && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Global
                </span>
              )}
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {notification.message}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatDate(notification.created_at || notification.createdAt)}
              </span>

              {!notification.is_read && (
                <button
                  onClick={() => onMarkAsRead([notification.id])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main notifications component
const NotificationsCenter = () => {
  const { token, userId, isAuthenticated, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filter notifications based on current filter
  const getFilteredNotifications = useCallback(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => !n.is_read);
    if (filter === "read") return notifications.filter(n => n.is_read);
    return notifications;
  }, [notifications, filter]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (page = 1, resetData = false) => {
      if (!isAuthenticated || !userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await notificationService.fetchNotifications(userId, {
          page,
          limit: pagination.limit,
        });

        if (response.success) {
          const newNotifications = response.data;

          if (resetData || page === 1) {
            setNotifications(newNotifications);
          } else {
            setNotifications((prev) => [...prev, ...newNotifications]);
          }

          setPagination({
            page: response.page,
            limit: response.limit,
            total: response.total,
            pages: response.pages,
          });
        } else {
          throw new Error(response.error || "Failed to fetch notifications");
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch notifications error:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId, isAuthenticated, pagination.limit],
  );

  // Mark notifications as read
  const handleMarkAsRead = async (notificationIds) => {
    if (!userId) return;

    try {
      const response = await notificationService.markAsRead(
        notificationIds,
        userId,
      );

      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, is_read: true }
              : notification,
          ),
        );

        // Clear selection
        setSelectedIds(new Set());
      } else {
        throw new Error(response.error || "Failed to update notifications");
      }
    } catch (err) {
      setError(err.message);
      console.error("Mark as read error:", err);
    }
  };

  // Handle selection
  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const filteredNotifications = getFilteredNotifications();
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchNotifications(pagination.page + 1, false);
    }
  };

  // Filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedIds(new Set()); // Clear selections when filter changes
  };

  // Initial load
  useEffect(() => {
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  // Supabase realtime subscription
  useEffect(() => {

    if (!isAuthenticated || !userId) return;

    // Subscribe to notifications table changes for the current user
    const subscription = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime notification update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              // Add new notification to the beginning of the list
              setNotifications(prev => [payload.new, ...prev]);
              break;
              
            case 'UPDATE':
              // Update existing notification
              setNotifications(prev =>
                prev.map(notification =>
                  notification.id === payload.new.id
                    ? { ...notification, ...payload.new }
                    : notification
                )
              );
              break;
              
            case 'DELETE':
              // Remove deleted notification
              setNotifications(prev =>
                prev.filter(notification => notification.id !== payload.old.id)
              );
              break;
              
            default:
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications realtime updates');
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('Unsubscribing from notifications realtime updates');
      supabase.removeChannel(subscription);
    };
  }, [isAuthenticated, userId]);

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-gray-600">
          Please log in to view your notifications.
        </p>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const selectedCount = selectedIds.size;

  return (
    <Layout  headerStyle={3} footerStyle={1} breadcrumbTitle="Notifications">
    <div className=" mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} unread
            </span>
          )}
        </div>

        <button
          onClick={() => fetchNotifications(1, true)}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh {" "}
          {loading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex space-x-2">
            {["all", "unread", "read"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => handleFilterChange(filterOption)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption === "all" && ` (${notifications.length})`}
                {filterOption === "unread" && ` (${notifications.filter(n => !n.is_read).length})`}
                {filterOption === "read" && ` (${notifications.filter(n => n.is_read).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedCount} selected
            </span>
            <button
              onClick={() => handleMarkAsRead(Array.from(selectedIds))}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark Read
            </button>
          </div>
        )}
      </div>

      {/* Select all */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center mb-4 p-2 bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={
              selectedIds.size === filteredNotifications.length &&
              filteredNotifications.length > 0
            }
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-600">
            Select all {filter} notifications
          </label>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Notifications list */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading && filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === "unread"
                ? "You're all caught up!"
                : filter === "read"
                ? "No read notifications."
                : "No notifications to display."}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onSelect={handleSelect}
                isSelected={selectedIds.has(notification.id)}
              />
            ))}

            {/* Load more button */}
            {pagination.page < pagination.pages && (
              <div className="p-4 border-t border-gray-200 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More ({pagination.total - filteredNotifications.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination info */}
      {filteredNotifications.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredNotifications.length} of {pagination.total} notifications
        </div>
      )}
    </div>
    </Layout>
  );
};

export default NotificationsCenter;