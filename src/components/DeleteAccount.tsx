import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";

export function DeleteAccount() {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");
  const remove = useServerFn(deleteMyAccount);
  const qc = useQueryClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user));
    return () => data.subscription.unsubscribe();
  }, []);
  const submit = async () => {
    if (confirmation !== "DELETE" || busy) return;
    setBusy(true); setError("");
    try {
      await remove({ data: { confirmation: "DELETE" } });
      await qc.cancelQueries(); qc.clear();
      await supabase.auth.signOut({ scope: "local" });
      const reg = await navigator.serviceWorker?.getRegistration();
      await reg?.pushManager?.getSubscription().then(subscription => subscription?.unsubscribe()).catch(() => {});
      ["mwa.home.city", "mwa-prefs-v1"].forEach(key => localStorage.removeItem(key));
      setDeleted(true); setOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Deletion failed. Please try again."); }
    finally { setBusy(false); }
  };
  if (deleted) return <p role="status" className="text-accent py-4">Your account and associated personal data have been deleted. <Link to="/" className="underline">Return to weather</Link></p>;
  return <section className="border-t border-border pt-6 space-y-3">
    <h2 className="font-display text-xl">Delete account</h2>
    <p className="text-sm text-muted-foreground">Permanently remove your account, saved locations, notification subscriptions, preferences, storm reports, photos, comments, and reactions. This cannot be undone.</p>
    {signedIn ? <Button variant="destructive" onClick={() => { setOpen(true); setConfirmation(""); setError(""); }}><Trash2 /> Delete my account</Button> : <Button asChild variant="outline"><Link to="/auth">Sign in to delete your account</Link></Button>}
    <Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Delete your account permanently?</DialogTitle><DialogDescription>Your personal data and uploaded photos will be removed. You will be signed out.</DialogDescription></DialogHeader>
        <Label htmlFor="delete-confirmation">Type DELETE to confirm</Label>
        <Input id="delete-confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="off" disabled={busy} />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" disabled={busy} onClick={() => setOpen(false)}>Keep account</Button><Button variant="destructive" disabled={confirmation !== "DELETE" || busy} onClick={submit}><Trash2 />{busy ? "Deleting…" : "Permanently delete"}</Button></div>
      </DialogContent>
    </Dialog>
  </section>;
}