import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Sparkles, ChevronRight } from "lucide-react";

const DISMISS_KEY = "mws.miweather-banner.dismissed.v1";

export function MiWeatherBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(DISMISS_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
  };

  if (dismissed) return null;

  return (
    <aside
      role="region"
      aria-label="Project MIWeather Announcement"
      className="relative z-40 w-full px-3 pt-2.5 min-[1100px]:pl-[228px] transition-all"
    >
      <div className="rounded-xl border border-primary/30 bg-card/85 p-3.5 shadow-md backdrop-blur-md text-foreground">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none select-none mt-0.5" aria-hidden="true">
            🌙
          </span>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-bold text-[13px] tracking-wide text-foreground">
                We are sunsetting Michigan Weather Service this November
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-2.5 w-2.5" /> Project MIWeather
              </span>
            </div>

            <p className="text-[12px] text-muted-foreground leading-relaxed">
              We are making a big change and revamp to our services. The following changes will be made:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-foreground/90 font-mono mt-1">
              <li>• New Name: <strong>MIWeather by Michigan Weather Authority</strong></li>
              <li>• New branding, official logo & refreshed colors</li>
              <li>• <strong>ENTIRE LOOK OF SITE</strong> (same info, completely new design)</li>
              <li>• Brand-new settings page with custom options</li>
              <li>• Completely redone live status page</li>
              <li>• <strong>TONS of new features</strong> (including Hailey, our conversational AI weather bot, Great Lakes metrics & more)</li>
            </ul>

            <div className="pt-1">
              <Link
                to="/changelog"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
              >
                Click here to see the project roadmap in the changelog
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss Project MIWeather announcement"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
