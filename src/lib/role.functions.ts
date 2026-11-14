import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getManagementAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const email = claims.email?.toLowerCase() ?? "";

    // Hard-locked owner access
    if (email === "greenhenry441@gmail.com") {
      return { authorized: true, role: "owner", email };
    }

    // Check user_roles table
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roles = (data ?? []).map((r) => r.role.toLowerCase());
    const isAuthorized = roles.some((r) => ["owner", "admin", "management", "moderator"].includes(r));

    return {
      authorized: isAuthorized,
      role: roles[0] ?? "user",
      email,
    };
  });
