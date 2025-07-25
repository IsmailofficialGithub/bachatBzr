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
    // Input validation with early returns
    if (!title?.trim() || !message?.trim() || !type?.trim()) {
      return { 
        success: false, 
        error: "Title, message, and type are required and cannot be empty" 
      };
    }

    if (!is_global && (!user_id || (Array.isArray(user_id) && user_id.length === 0))) {
      return { 
        success: false, 
        error: "user_id is required for non-global notifications" 
      };
    }

    // Normalize user_id to array and filter out invalid values
    const userIds = is_global 
      ? [null] 
      : (Array.isArray(user_id) ? user_id : [user_id])
          .filter(id => id != null && id !== ''); // Remove null, undefined, empty strings

    if (!is_global && userIds.length === 0) {
      return { 
        success: false, 
        error: "No valid user IDs provided" 
      };
    }

    // Create notification template to avoid repetition
    const notificationTemplate = {
      title: title.trim(),
      message: message.trim(), 
      type: type.trim(),
      order_id,
      is_global,
      created_at: new Date().toISOString(), // Add timestamp if not auto-generated
    };

    // Map notifications with proper user_id handling
    const notifications = userIds.map(uid => ({
      ...notificationTemplate,
      user_id: is_global ? null : uid,
    }));

    // Insert with error handling
    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select(); // Add select() to return inserted data if needed

    if (error) {
      throw new Error(`Database insertion failed: ${error.message}`);
    }

    return { 
      success: true, 
      data, // Return inserted data
      count: notifications.length 
    };

  } catch (err) {
    // More specific error logging
    console.error("Notification creation error:", {
      error: err.message,
      stack: err.stack,
      input: { user_id, title, message, type, order_id, is_global }
    });
    
    return { 
      success: false, 
      error: err.message || "An unexpected error occurred" 
    };
  }
}

// Alternative: Batch processing for large user lists
export async function createNotificationBatch({
  user_id,
  title,
  message,
  type,
  order_id = null,
  is_global = false,
  batch_size = 100, // Process in batches to avoid query limits
}) {
  try {
    // Same validation as above
    if (!title?.trim() || !message?.trim() || !type?.trim()) {
      return { 
        success: false, 
        error: "Title, message, and type are required and cannot be empty" 
      };
    }

    if (!is_global && (!user_id || (Array.isArray(user_id) && user_id.length === 0))) {
      return { 
        success: false, 
        error: "user_id is required for non-global notifications" 
      };
    }

    const userIds = is_global 
      ? [null] 
      : (Array.isArray(user_id) ? user_id : [user_id])
          .filter(id => id != null && id !== '');

    if (!is_global && userIds.length === 0) {
      return { 
        success: false, 
        error: "No valid user IDs provided" 
      };
    }

    const notificationTemplate = {
      title: title.trim(),
      message: message.trim(),
      type: type.trim(),
      order_id,
      is_global,
      created_at: new Date().toISOString(),
    };

    // Process in batches for large user lists
    const results = [];
    for (let i = 0; i < userIds.length; i += batch_size) {
      const batch = userIds.slice(i, i + batch_size);
      const notifications = batch.map(uid => ({
        ...notificationTemplate,
        user_id: is_global ? null : uid,
      }));

      const { data, error } = await supabase
        .from("notifications")
        .insert(notifications)
        .select();

      if (error) {
        throw new Error(`Batch ${Math.floor(i / batch_size) + 1} failed: ${error.message}`);
      }

      results.push(...(data || []));
    }

    return { 
      success: true, 
      data: results,
      count: results.length 
    };

  } catch (err) {
    console.error("Batch notification creation error:", {
      error: err.message,
      stack: err.stack,
      input: { user_id, title, message, type, order_id, is_global, batch_size }
    });
    
    return { 
      success: false, 
      error: err.message || "An unexpected error occurred" 
    };
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
