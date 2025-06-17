"use client";
import useSWR from "swr";
import { axiosFetcher } from "@/lib/fetcher";
import { useSelector } from "react-redux";

export default function NotificationListShow() {
  const { user } = useSelector((state) => state.auth);

  const shouldFetch = !!user?.id;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/notification/length?userId=${user.id}` : null,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000 * 60 * 5, // 5 minutes
      onSuccess: () => {
        console.log("📩 Notification API called");
      },
    },
  );

  if (!shouldFetch) return null;
  if (error) return <span className="tp-product-count">Err</span>;
  if (isLoading || !data) return <span className="tp-product-count">...</span>;

  const unreadNotifications = data?.data?.unread ?? 0;

  return <span className="tp-product-count">{unreadNotifications}</span>;
}
