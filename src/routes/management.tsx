import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, Plus, Trash2, Power, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { getManagementAccess } from "@/lib/role.functions";
import {
  listStatusUpdatesAdmin,
  createStatusUpdate,
  toggleStatusUpdate,
  deleteStatusUpdate,
} from "@/lib/management.functions";

export const Route = createFileRoute("/management")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Management · MIWeather" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ManagementPage,
});

function ManagementPage() {
  const [auth, setAuth] = useState<{ authorized: boolean; role?: string; email?: string } | null>(null);
  const check = useServerFn(getManagementAccess);
  const qc = useQueryClient();

  useEffect(() => {
    check()
      .then((res) => setAuth(res))
      .catch(() => setAuth({ authorized: false }));
  }, [check]);

  const updatesQ = useQuery({
    queryKey: ["admin-status-updates"],
    queryFn: () => listStatusUpdatesAdmin(),
    enabled: !!auth?.authorized,
  });

  const [kind, setKind] = useState<"info" | "warning" | "critical">("info");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [actionText, setActionText] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (auth === null) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-violet-400" /> Verifying MIWeather management credentials...
        </div>
      </div>
    );
  }

  if (!auth.authorized) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-4">
        <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            You must be signed in as an Owner (greenhenry441@gmail.com) or hold a Management role to access this console.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) { toast.error("Headline is required"); return; }
    setSubmitting(true);
    try {
      await createStatusUpdate({ data: { kind, headline, body: body || undefined, action_text: actionText || undefined, action_url: actionUrl || undefined } });
      toast.success("Status banner published live");
      setHeadline(""); setBody(""); setActionText(""); setActionUrl("");
      qc.invalidateQueries({ queryKey: ["admin-status-updates"] });
      qc.invalidateQueries({ queryKey: ["active-status-updates"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <Toaster richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-violet-400" /> MIWeather Management Console
              </h1>
              <p className="text-xs text-muted-foreground">Logged in as {auth.email} ({auth.role})</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/command">Open Command →</Link>
          </Button>
        </div>

        {/* Post Status Update */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-violet-400" /> Issue Network Broadcast Banner
          </h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Severity Level</Label>
                <Select value={kind} onValueChange={(v: any) => setKind(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info (Blue)</SelectItem>
                    <SelectItem value="warning">Warning (Amber)</SelectItem>
                    <SelectItem value="critical">Critical (Red EAS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Headline</Label>
                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Winter Storm Warning issued..." className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Details (optional)</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full advisory details..." className="mt-1" rows={2} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-violet-600 hover:bg-violet-500">
              {submitting ? "Broadcasting..." : "Publish Live Banner"}
            </Button>
          </form>
        </div>

        {/* Existing Updates */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold">Active Broadcast Banners</h2>
          {updatesQ.data?.map((u: any) => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-muted mr-2">{u.kind}</span>
                <span className="text-xs font-semibold">{u.headline}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await deleteStatusUpdate({ data: { id: u.id } });
                  qc.invalidateQueries({ queryKey: ["admin-status-updates"] });
                }}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
