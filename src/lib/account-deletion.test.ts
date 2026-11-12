import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { removeOwnAccount } from "./account-deletion.server";

function fixture(failure = false) {
  const list = vi.fn().mockResolvedValueOnce({ data: [{ name: "photo.jpg" }], error: null }).mockResolvedValue({ data: [], error: null });
  const remove = vi.fn().mockResolvedValue({ error: failure ? new Error("blocked") : null });
  const eq = vi.fn().mockResolvedValue({ error: null });
  const deleteUser = vi.fn().mockResolvedValue({ error: null });
  const client = { storage: { from: vi.fn(() => ({ list, remove })) }, from: vi.fn(() => ({ delete: () => ({ eq }) })), auth: { admin: { deleteUser } } };
  return { client: client as unknown as SupabaseClient<Database>, list, remove, eq, deleteUser };
}
describe("self-account deletion", () => {
  it("deletes only the authenticated account and its photos and delivery history", async () => {
    const f = fixture();
    await expect(removeOwnAccount(f.client, "own-user")).resolves.toEqual({ deleted: true });
    expect(f.list).toHaveBeenCalledWith("own-user", { limit: 100 });
    expect(f.remove).toHaveBeenCalledWith(["own-user/photo.jpg"]);
    expect(f.eq).toHaveBeenCalledWith("user_id", "own-user");
    expect(f.deleteUser).toHaveBeenCalledExactlyOnceWith("own-user");
  });
  it("does not delete the identity when photo cleanup fails", async () => {
    const f = fixture(true);
    await expect(removeOwnAccount(f.client, "own-user")).rejects.toThrow("Photo cleanup failed");
    expect(f.deleteUser).not.toHaveBeenCalled();
  });
  it("rejects a missing signed-in identity", async () => {
    const f = fixture();
    await expect(removeOwnAccount(f.client, "")).rejects.toThrow("Sign in");
    expect(f.list).not.toHaveBeenCalled();
  });
});