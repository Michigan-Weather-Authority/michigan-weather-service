import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Only the middleware-verified identity is accepted; never accept a target ID from a form.
export async function removeOwnAccount(admin: SupabaseClient<Database>, userId: string) {
  if (!userId) throw new Error("Sign in before deleting your account.");
  const bucket = admin.storage.from("storm-photos");
  // Remove in batches from offset zero so deletion does not skip later files.
  for (;;) {
    const { data: files, error } = await bucket.list(userId, { limit: 100 });
    if (error) throw new Error("Photo cleanup failed. Please try again.");
    if (!files?.length) break;
    const { error: removeError } = await bucket.remove(files.map(file => `${userId}/${file.name}`));
    if (removeError) throw new Error("Photo cleanup failed. Please try again.");
  }
  const { error: logError } = await admin.from("push_delivery_log").delete().eq("user_id", userId);
  if (logError) throw new Error("Notification history cleanup failed. Please try again.");
  // Existing database foreign keys cascade all profile, report, location, preference,
  // threshold, subscription, role, comment, reaction and scheduled-alert records.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error("Account deletion failed. Please try again.");
  return { deleted: true };
}