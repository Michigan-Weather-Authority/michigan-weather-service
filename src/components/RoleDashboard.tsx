import { useState, useEffect } from "react";
import { Car, Waves, Tractor, Activity, Users, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MI_ROLES } from "./HaileyOnboarding";

interface RoleDashboardProps {
  currentTemp: number;
  feelsLike?: number | null;
  windSpeed: number;
  windGust?: number | null;
  humidity?: number | null;
  dewpoint?: number | null;
  precipProb?: number | null;
  hourlyPeriods?: any[];
  cityName: string;
}

export function RoleDashboard({
  currentTemp,
  windSpeed,
  windGust,
  precipProb = 0,
  hourlyPeriods = [],
  cityName,
}: RoleDashboardProps) {
  const [activeRoles, setActiveRoles] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("miweather_roles_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveRoles(parsed);
          setSelectedFilter(parsed[0]); // default to first active role
        }
      }
    } catch {
      // fallback
    }
  }, []);

  // Compute live Michigan role insights
  const isFreezing = currentTemp <= 32;
  const hasMoisture = (precipProb ?? 0) >= 30;
  const flashFreezeRisk = isFreezing && hasMoisture;
  const smallCraftRisk = windSpeed >= 18 || (windGust ?? 0) >= 25;
  const frostRisk = hourlyPeriods.slice(0, 14).some((p) => p.temperature <= 36);
  const goodSprayWindow = windSpeed >= 3 && windSpeed <= 10 && (precipProb ?? 0) < 20;

  // Morning bus stop estimate (around 7-8 AM)
  const morningPeriod = hourlyPeriods.find((p) => {
    const hr = new Date(p.startTime).getHours();
    return hr >= 7 && hr <= 8;
  });

  const availableRoles = MI_ROLES.filter((r) => activeRoles.includes(r.id));

  if (activeRoles.length === 0) {
    return (
      <div className="rounded-xl border border-violet-500/20 bg-violet-950/10 p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">Tailor your Michigan dashboard</h4>
            <p className="text-[11px] text-muted-foreground">Pick roles (Commuter, Marine, Ag, etc.) to unlock specialized metrics.</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("miweather_onboarding_v1_completed");
            window.location.reload();
          }}
          className="text-xs font-semibold text-violet-400 hover:text-violet-300 underline underline-offset-2 shrink-0"
        >
          Setup Roles →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Role Filter Selector */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Insights
          </button>
          {availableRoles.map((r) => {
            const Icon = r.icon;
            const active = selectedFilter === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedFilter(r.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {r.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("miweather_onboarding_v1_completed");
            window.location.reload();
          }}
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0 px-2 py-1"
          title="Edit role preferences"
        >
          <SlidersHorizontal className="h-3 w-3" /> Edit
        </button>
      </div>

      {/* Dynamic Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* COMMUTER CARD */}
        {(selectedFilter === "all" || selectedFilter === "commuter") && activeRoles.includes("commuter") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Car className="h-4 w-4 text-violet-400" /> Commuter Index
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                flashFreezeRisk ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {flashFreezeRisk ? "ELEVATED RISK" : "ROADS CLEAR"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Flash-Freeze Potential:</span>
                <span className="font-semibold text-foreground">{flashFreezeRisk ? "Caution on bridges / I-94" : "Low"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Precipitation Odds:</span>
                <span className="font-semibold text-foreground">{precipProb}%</span>
              </div>
            </div>
          </div>
        )}

        {/* MARINE CARD */}
        {(selectedFilter === "all" || selectedFilter === "marine") && activeRoles.includes("marine") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Waves className="h-4 w-4 text-cyan-400" /> Great Lakes Marine
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                smallCraftRisk ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {smallCraftRisk ? "ADVISORY CONDITIONS" : "FAVORABLE"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Wind & Gusts:</span>
                <span className="font-semibold text-foreground">{windSpeed} mph {windGust ? `(g ${windGust})` : ""}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Nearshore Waters:</span>
                <span className="font-semibold text-foreground">{smallCraftRisk ? "Choppy / 3-5 ft waves" : "Calm to 2 ft"}</span>
              </div>
            </div>
          </div>
        )}

        {/* AGRICULTURE CARD */}
        {(selectedFilter === "all" || selectedFilter === "ag") && activeRoles.includes("ag") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Tractor className="h-4 w-4 text-emerald-400" /> Ag & Farm Clock
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                frostRisk ? "bg-cyan-500/20 text-cyan-400" : "bg-muted text-muted-foreground"
              }`}>
                {frostRisk ? "FROST POSSIBLE" : "NO FROST"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Spray Window:</span>
                <span className="font-semibold text-foreground">{goodSprayWindow ? "Optimal (wind < 10mph)" : "Poor (drifting or wet)"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Overnight Low:</span>
                <span className="font-semibold text-foreground">{frostRisk ? "≤ 36°F expected" : "Above frost floor"}</span>
              </div>
            </div>
          </div>
        )}

        {/* OUTDOOR & RUNNER CARD */}
        {(selectedFilter === "all" || selectedFilter === "outdoor") && activeRoles.includes("outdoor") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Activity className="h-4 w-4 text-orange-400" /> Outdoor & Runner
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-muted text-foreground">
                {currentTemp >= 45 && currentTemp <= 65 ? "IDEAL TEMPS" : "SEASONAL"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Current Temp:</span>
                <span className="font-semibold text-foreground">{Math.round(currentTemp)}°F</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Trail Condition:</span>
                <span className="font-semibold text-foreground">{hasMoisture ? "Damp / Muddy" : "Dry & Firm"}</span>
              </div>
            </div>
          </div>
        )}

        {/* PARENT & FAMILY CARD */}
        {(selectedFilter === "all" || selectedFilter === "parent") && activeRoles.includes("parent") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Users className="h-4 w-4 text-pink-400" /> Bus Stop & Family
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-muted text-foreground">
                DAILY OUTLOOK
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>7:00–8:00 AM Bus Stop:</span>
                <span className="font-semibold text-foreground">
                  {morningPeriod ? `${Math.round(morningPeriod.temperature)}°F (${morningPeriod.shortForecast})` : `${Math.round(currentTemp)}°F`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Coat Recommendation:</span>
                <span className="font-semibold text-foreground">
                  {currentTemp < 35 ? "Heavy Winter Coat + Gloves" : currentTemp < 55 ? "Light Jacket / Fleece" : "No Jacket Needed"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STORM SPOTTER CARD */}
        {(selectedFilter === "all" || selectedFilter === "spotter") && activeRoles.includes("spotter") && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldAlert className="h-4 w-4 text-amber-400" /> Spotter Operations
              </span>
              <Link to="/spotter" className="text-[10px] text-accent hover:underline flex items-center gap-0.5">
                Submit Report <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Thunderstorm Risk:</span>
                <span className="font-semibold text-foreground">{(precipProb ?? 0) > 40 ? "Active / Monitor Radar" : "Low General"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>SPC Convective Outlook:</span>
                <Link to="/outlook" className="font-semibold text-accent hover:underline">
                  View SPC Day 1–8 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
