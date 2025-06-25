import { supabase } from "./supabaseSetup";

export async function createNotification({
  user_id,
  title,
  message,
  type,
  order_id = null,
  is_global = false,
}) {
  try {
    if (!title || !message || !type) {
      throw new Error("Missing required notification fields");
    }

    // If not global, user_id must be present
    if (!is_global && !user_id) {
      throw new Error("user_id is required for non-global notifications");
    }

    const { error } = await supabase.from("notifications").insert([
      {
        user_id: is_global ? null : user_id,
        title,
        message,
        type,
        order_id,
        is_global,
      },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Notification creation error:", err.message);
    return { success: false, error: err.message };
  }
}

// Example update for your getUserNotifications function in /lib/notifications.js

export async function getUserNotifications(
  userId,
  page = 1,
  limit = 10,
  filter = "all",
) {
  try {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the base query
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Apply filter
    if (filter === "unread") {
      query = query.eq("read", false);
    } else if (filter === "read") {
      query = query.eq("read", true);
    }
    // For 'all', we don't need to add any additional filter

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }

    return {
      success: true,
      message: "Notifications retrieved successfully",
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}

export async function markNotificationsAsRead(notificationIds, userId) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .in("id", notificationIds)
      .eq("user_id", userId) // Ensure user can only update their own notifications
      .select();

    if (error) {
      return {
        success: false,
        error: error.message,
        status: 400,
      };
    }

    return {
      success: true,
      message: `${data.length} notification(s) marked as read`,
      updatedCount: data.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}

export const getNotificationLength = async (userId) => {
  if (!userId) {
    return { success: false, error: "User not authenticated.", status: 401 };
  }

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("is_read")
      .eq("user_id", userId);

    if (error) throw error;

    const all = data.length;
    const unread = data.filter((n) => !n.is_read).length;
    const read = all - unread;

    return {
      success: true,
      data: {
        all,
        unread,
        read,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch notification stats.",
      status: 400,
    };
  }
};

export const deletingNotifications = async (userId, notificationIds) => {
  if (!userId) {
    return { success: false, error: "User not authenticated.", status: 401 };
  }
  if (notificationIds.length < 1) {
    return {
      success: false,
      error: "No notifications is selected",
      status: 401,
    };
  }
  try {
    const { data, error } = await supabase
    .from("notifications")
    .delete()
    .in('id',notificationIds)
    .eq("user_id",userId)
    ;
    if(!error){
      return {
      success: true,
      data
    }; 
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to Delete notification",
      status: 400,
    };
  }
};
