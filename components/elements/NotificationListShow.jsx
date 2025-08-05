

"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { axiosFetcher } from "@/lib/fetcher";
import { useSelector } from "react-redux";
import { supabase } from "@/lib/supabaseSetup"; // Adjust path to your supabase client
import { toast } from "react-toastify";

export default function NotificationListShow() {
  const { user } = useSelector((state) => state.auth);
  const [realtimeCount, setRealtimeCount] = useState(null);

  const shouldFetch = !!user?.id;

  const { data, mutate } = useSWR(
    shouldFetch ? `/api/notification/length?userId=${user.id}` : null,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
    },
  );

  useEffect(() => {
    if (!shouldFetch) return;

    // Subscribe to realtime changes
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`, // Filter for current user's notifications
        },
        (payload) => {
          toast.success("You have a new notification!");
          // Update the count immediately without waiting for API
          setRealtimeCount((prev) => {
            const currentCount = prev ?? data?.data?.unread ?? 0;
            return currentCount + 1;
          });

          // Optionally revalidate SWR data to sync with backend
          mutate();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Revalidate when notifications are marked as read/unread
          mutate();
          setRealtimeCount(null); // Reset to let SWR handle the count
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          mutate();
          setRealtimeCount(null); // Reset to let SWR handle the count
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [shouldFetch, user?.id, mutate, data?.data?.unread]);

  if (!shouldFetch) return null;

  // Use realtime count if available, otherwise fall back to SWR data
  const unreadNotifications = realtimeCount ?? data?.data?.unread ?? 0;

  return unreadNotifications === 0 ? (
    ""
  ) : (
    <span className="tp-product-count">{unreadNotifications}</span>
  );
}
