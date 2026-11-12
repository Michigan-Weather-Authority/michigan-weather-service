import { useEffect, useState } from "react";
import { Volume2, Square, CloudSun, Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { ForecastPeriod } from "@/lib/weather-api";

export function WeatherBriefing({ city, periods, alertCount }: { city: string; periods: ForecastPeriod[]; alertCount: number | null }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setSupported("speechSynthesis" in window); return () => window.speechSynthesis?.cancel(); }, []);
  useEffect(() => { window.speechSynthesis?.cancel(); setSpeaking(false); }, [city]);
  const next = periods.slice(0, 12);
  if (!next.length) return null;
  const temps = next.map(period => period.temperature);
  const rain = next.map(period => period.probabilityOfPrecipitation?.value).filter((value): value is number => value != null);
  const summary = `${city}. ${next[0].shortForecast}. Over the next 12 hours, temperatures range from ${Math.round(Math.min(...temps))} to ${Math.round(Math.max(...temps))} degrees ${next[0].temperatureUnit}. ${rain.length ? `Peak precipitation chance is ${Math.max(...rain)} percent.` : "Precipitation probability is unavailable."} ${alertCount == null ? "Local alert status is updating." : `${alertCount} active local alerts.`}`;
  const speak = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    setError("");
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setError("Read-aloud is unavailable on this device."); };
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setSpeaking(true);
  };
  return <section className="border-l-4 border-accent bg-accent/10 p-4 sm:p-5 mt-6" aria-label="Local weather briefing">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl flex items-center gap-2"><CloudSun className="h-5 w-5 text-accent" /> Your next 12 hours</h3>{supported && <Button size="sm" variant="outline" onClick={speak} aria-pressed={speaking}>{speaking ? <Square /> : <Volume2 />}{speaking ? "Stop reading" : "Listen to forecast"}</Button>}</div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4"><div><p className="text-xs text-muted-foreground">Temperature range</p><p className="font-display text-2xl">{Math.round(Math.min(...temps))}°–{Math.round(Math.max(...temps))}°{next[0].temperatureUnit}</p></div><div><p className="text-xs text-muted-foreground">Peak precipitation chance</p><p className="font-display text-2xl">{rain.length ? `${Math.max(...rain)}%` : "—"}</p></div><Link to="/alerts-map" className="text-accent flex items-center gap-2 self-center text-sm"><Bell className="h-4 w-4 shrink-0" />{alertCount == null ? "Alerts updating…" : `${alertCount} local alert${alertCount === 1 ? "" : "s"}`} →</Link></div>
    {error && <p role="status" className="text-sm text-muted-foreground mt-3">{error}</p>}
  </section>;
}