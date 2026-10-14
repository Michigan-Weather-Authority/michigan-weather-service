import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Smartphone, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createIphoneWidget } from "@/lib/iphone-widget";
import { MICHIGAN_CITIES } from "@/lib/michigan-cities";

export const Route = createFileRoute("/widgets")({
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === "string" ? search.city : "Detroit",
    lat: Number.isFinite(Number(search.lat)) ? Number(search.lat) : 42.3314,
    lon: Number.isFinite(Number(search.lon)) ? Number(search.lon) : -83.0458,
  }),
  head: () => ({ meta: [
    { title: "iPhone Widget — Michigan Weather Service" },
    { name: "description", content: "Download a real Michigan Weather Service home-screen widget for iPhone using Scriptable." },
    { property: "og:title", content: "iPhone Widget — Michigan Weather Service" },
    { property: "og:description", content: "Your local temperature and forecast on your iPhone home screen with Scriptable." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: WidgetsPage,
});

function WidgetsPage() {
  const initial = Route.useSearch();
  const [place, setPlace] = useState(initial);
  const [query, setQuery] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const results = query.trim() ? MICHIGAN_CITIES.filter(c => `${c.name} ${c.zip}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  const download = () => {
    const url = URL.createObjectURL(new Blob([createIphoneWidget(place)], { type: "text/javascript;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "MWS Weather.js"; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };
  return <main className="min-h-screen max-w-5xl mx-auto px-5 py-8 sm:py-12">
    <Button asChild variant="ghost" className="mb-8"><Link to="/"><ArrowLeft /> Weather</Link></Button>
    <p className="text-xs font-mono text-accent uppercase mb-3">Michigan Weather Service</p>
    <h1 className="text-4xl sm:text-5xl font-display">Your weather. At a glance.</h1>
    <p className="text-muted-foreground mt-4 max-w-xl">A real iPhone home-screen widget, powered by the free Scriptable app. No paid weather subscription.</p>
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 mt-10 border-y border-border py-8">
      <div className="space-y-5 min-w-0">
        <h2 className="text-xl font-display flex items-center gap-2"><Smartphone className="text-accent h-5 w-5" /> {place.city}, Michigan</h2>
        <Label htmlFor="widget-city">Widget location</Label>
        <Input id="widget-city" placeholder="Search Michigan city or ZIP" value={query} onChange={e => setQuery(e.target.value)} />
        {results.length > 0 && <div className="divide-y divide-border">{results.map(c => <Button key={c.zip} variant="ghost" className="w-full justify-between" onClick={() => { setPlace({ city: c.name, lat: c.lat, lon: c.lon }); setQuery(""); setDownloaded(false); }}>{c.name}<span className="text-muted-foreground">{c.zip}</span></Button>)}</div>}
        {query.trim() && !results.length && <p className="text-sm text-muted-foreground">No matching Michigan locations.</p>}
        <Button onClick={download}><Download /> Download iPhone widget</Button>
        {downloaded && <p role="status" className="text-sm text-accent">Widget downloaded for {place.city}. Import it into Scriptable on your iPhone.</p>}
        <p className="text-sm text-muted-foreground">Temperature, feels-like, daily high and low, and an updated time. Tap the widget to open MWS.</p>
        <CloudSun className="h-16 w-16 text-accent" aria-hidden />
      </div>
      <div className="min-w-0">
        <h2 className="text-xl font-display mb-5">Add it to your iPhone</h2>
        <ol className="space-y-5 list-decimal pl-5 text-sm leading-relaxed">
          <li>Install <a className="text-accent underline" href="https://apps.apple.com/app/scriptable/id1405459188" target="_blank" rel="noopener noreferrer">Scriptable from the App Store</a>.</li>
          <li>Download the widget above. In Files, open “MWS Weather.js”, use Share, and choose Scriptable. If it opens as text, copy it into a new Scriptable script named “MWS Weather”.</li>
          <li>Run the script once in Scriptable to preview it and allow internet access if prompted.</li>
          <li>Hold an empty area of your home screen, tap Edit → Add Widget, and choose Scriptable in the small or medium size.</li>
          <li>Hold the widget → Edit Widget → Script → “MWS Weather”. Set “When Interacting” to “Open URL”.</li>
        </ol>
      </div>
    </div>
    <p className="text-sm text-muted-foreground mt-6 max-w-3xl">Requires Scriptable; this is not a standalone App Store app. iOS decides refresh timing, so updates are not continuous. The widget uses Open-Meteo forecasts, saves the last successful reading offline, and does not deliver emergency alerts. Keep MWS push notifications enabled for alerts.</p>
  </main>;
}