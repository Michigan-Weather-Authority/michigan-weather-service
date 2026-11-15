import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Waves, Wind, Thermometer, ShieldAlert, Navigation } from "lucide-react";

export const Route = createFileRoute("/great-lakes")({
  head: () => ({
    meta: [
      { title: "Great Lakes Marine Dashboard · MIWeather" },
      { name: "description", content: "Live wave heights, water temperatures, and buoy observations across Michigan's Great Lakes." },
      { property: "og:title", content: "Great Lakes Marine Dashboard · MIWeather" },
      { property: "og:description", content: "Explore Michigan's Great Lakes marine dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GreatLakesPage,
});

const LAKES = [
  { id: "superior", name: "Lake Superior", wave: "4–7 ft", temp: "42°F", wind: "NW 22 kt", status: "Small Craft Advisory" },
  { id: "michigan", name: "Lake Michigan", wave: "2–4 ft", temp: "54°F", wind: "W 14 kt", status: "Favorable" },
  { id: "huron", name: "Lake Huron", wave: "3–5 ft", temp: "51°F", wind: "N 18 kt", status: "Exercise Caution" },
  { id: "stclair", name: "Lake St. Clair", wave: "1–2 ft", temp: "56°F", wind: "SW 9 kt", status: "Calm" },
  { id: "erie", name: "Lake Erie", wave: "2–3 ft", temp: "57°F", wind: "SW 12 kt", status: "Favorable" },
];

function GreatLakesPage() {
  const [selectedLake, setSelectedLake] = useState(LAKES[1]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-accent border border-primary/20">
          <Waves className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Great Lakes Marine Hub</h1>
          <p className="text-xs text-muted-foreground">Nearshore marine observations, wave modeling, and gale alerts.</p>
        </div>
      </div>

      {/* Lake Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {LAKES.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLake(l)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedLake.id === l.id
                ? "bg-primary text-primary-foreground shadow-md shadow-none"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Selected Lake Card */}
      <div className="rounded-lg border border-primary/30 bg-card p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{selectedLake.name} Nearshore</h2>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-primary/20 text-accent">
            {selectedLake.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Waves className="h-4 w-4 text-accent" /> Wave Height</span>
            <p className="text-xl font-bold text-foreground">{selectedLake.wave}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Wind className="h-4 w-4 text-accent" /> Marine Winds</span>
            <p className="text-xl font-bold text-foreground">{selectedLake.wind}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Thermometer className="h-4 w-4 text-accent" /> Surface Temp</span>
            <p className="text-xl font-bold text-foreground">{selectedLake.temp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
