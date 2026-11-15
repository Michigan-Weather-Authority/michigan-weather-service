import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sparkles, Check, ArrowRight, X, Compass, Tractor, Car, Waves, Activity, Users, ShieldAlert, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { askHailey } from "@/lib/hailey.functions";

export const MI_ROLES = [
  { id: "commuter", label: "Commuter", desc: "Highway corridors, flash-freeze, and rush-hour visibilities", icon: Car },
  { id: "marine", label: "Marine & Boating", desc: "Great Lakes waves, water temps, and small-craft advisories", icon: Waves },
  { id: "ag", label: "Agriculture", desc: "Frost clocks, growing degree days (GDD), and spray windows", icon: Tractor },
  { id: "outdoor", label: "Outdoor & Runner", desc: "Air quality (AQI), UV index, wind chill, and trail conditions", icon: Activity },
  { id: "parent", label: "Parent & Family", desc: "Bus stop forecasts, snow day odds, and weekend outdoor plans", icon: Users },
  { id: "spotter", label: "Storm Spotter", desc: "SPC convective outlooks, CAPE values, and spotter reporting", icon: ShieldAlert },
] as const;

export function HaileyOnboarding() {
  const [open, setOpen] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [county, setCounty] = useState("Kent");
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem("miweather_onboarding_v1_completed");
    if (completed) return;

    // Check if user is already signed in (prior to onboarding)
    supabase.auth.getUser().then(({ data }) => {
      const isAuth = !!data?.user;
      // If signed up just now in the current session, auth.tsx can set a flag
      const justSignedUp = sessionStorage.getItem("miweather_just_signed_up") === "true";
      
      setIsExistingUser(isAuth && !justSignedUp);
      setOpen(true);
    });
  }, []);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    localStorage.setItem("miweather_onboarding_v1_completed", "true");
    localStorage.setItem("miweather_roles_v1", JSON.stringify(selectedRoles));
    sessionStorage.removeItem("miweather_just_signed_up");
    setOpen(false);
  };

  const requestHaileyTip = async () => {
    setLoadingAi(true);
    setStep(3);
    try {
      const roleNames = selectedRoles.length ? selectedRoles.join(", ") : "General Michigan Resident";
      const res = await askHailey({
        data: {
          question: "Give me a 2-sentence welcoming greeting and a custom Michigan weather tip for my roles.",
          county,
          role: roleNames,
        },
      });
      setAiTip(res.answer);
    } catch {
      setAiTip("Welcome aboard! Your personalized MIWeather forecast is now tuned to your specific needs.");
    } finally {
      setLoadingAi(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-lg border border-primary/30 bg-background/95 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient violet glow */}


        {/* Dismiss button */}
        <Button
          onClick={handleFinish}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Skip onboarding"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* STEP 1: Hailey Intro */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-accent border border-primary/30 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {isExistingUser
                    ? "Hey! I'm Hailey, your AI Onboarding assistant."
                    : "Hello! I'm Hailey, your AI Onboarding Assistant."}
                </h2>
                <p className="text-sm font-medium text-accent">
                  {isExistingUser
                    ? "MIWeather is here. Let's get you started."
                    : "Welcome to MIWeather, let's get started."}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              We're revamping our services to bring you hyper-localized Michigan forecasts, specialized lake-effect trackers, and tailored metrics designed specifically for your daily routine.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                onClick={handleFinish}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Skip for now
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-none hover:bg-primary transition-colors"
              >
                Choose My Roles <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Role Selector */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-foreground">What matters most to you?</h3>
              <p className="text-xs text-muted-foreground">Select any that apply. You can change these anytime in Settings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {MI_ROLES.map((r) => {
                const active = selectedRoles.includes(r.id);
                const Icon = r.icon;
                return (
                  <Button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    className={`flex items-start gap-3 p-3 text-left rounded-lg border transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/50"
                        : "border-border/60 bg-card hover:border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${active ? "text-accent" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${active ? "text-foreground" : "text-foreground/90"}`}>
                          {r.label}
                        </span>
                        {active && <Check className="h-3.5 w-3.5 text-accent" />}
                      </div>
                      <p className="text-[11px] leading-tight text-muted-foreground mt-0.5 line-clamp-2">
                        {r.desc}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={requestHaileyTip}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-none hover:bg-primary transition-colors"
              >
                Tuning with Hailey <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: AI Welcome & Kickoff */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-accent border border-primary/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Hailey's Personalized Briefing</h3>
                <p className="text-xs text-muted-foreground">Tuned for {selectedRoles.length} selected role{selectedRoles.length === 1 ? "" : "s"}</p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-muted/40 p-4 min-h-[90px] flex items-center justify-center">
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-accent">
                  <Loader2 className="h-4 w-4 animate-spin" /> Hailey is tuning your dashboard...
                </div>
              ) : (
                <p className="text-xs md:text-sm text-foreground/90 leading-relaxed italic">
                  "{aiTip}"
                </p>
              )}
            </div>

            <Button
              onClick={handleFinish}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-none hover:bg-primary transition-colors"
            >
              Launch MIWeather
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
