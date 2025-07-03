import { supabase } from "./supabaseSetup";

export async function CheckRouteRole(request, role) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { success: false, error: "No token provided" };
    }
    const token = authHeader.substring(7);

    // Verify JWT token with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return { success: false, error: "Invalid token" };
    }

    // Check admin status from database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profileError) {
      return { success: false, error: "Profile not found" };
    } else {
     
      if (!Array.isArray(role)) {
        role = [role]; // convert string to array
      }

      if (!role.includes(profile.role)) {
        return { success: false, error: "You cannot have access to use this route" };
      } else {
        return { success: true, role: profile.role };
      }
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
