import type { AlertSeverity } from "./nws-alert-types";

export interface ProductType { id: string; name: string; code: string }

export const OUTLOOK_TYPES: ProductType[] = [
  { id: "severe-outlook", name: "Severe Weather Outlook", code: "SWO" },
  { id: "winter-outlook", name: "Winter Weather Outlook", code: "WWO" },
  { id: "lake-effect-outlook", name: "Lake-Effect Snow Outlook", code: "LEO" },
  { id: "hazardous-outlook", name: "Hazardous Weather Outlook", code: "HWO" },
  { id: "flood-outlook", name: "Flood Outlook", code: "FLO" },
  { id: "fire-outlook", name: "Fire Weather Outlook", code: "FWO" },
  { id: "heat-outlook", name: "Heat Outlook", code: "HTO" },
  { id: "marine-outlook", name: "Marine Outlook", code: "MRO" },
  { id: "extended-outlook", name: "Extended 6–10 Day Outlook", code: "EXO" },
];

export const OUTLOOK_RISKS: { id: string; label: string; severity: AlertSeverity }[] = [
  { id: "general", label: "General", severity: "minor" },
  { id: "marginal", label: "Marginal (1/5)", severity: "minor" },
  { id: "slight", label: "Slight (2/5)", severity: "moderate" },
  { id: "enhanced", label: "Enhanced (3/5)", severity: "moderate" },
  { id: "moderate", label: "Moderate (4/5)", severity: "severe" },
  { id: "high", label: "High (5/5)", severity: "extreme" },
];

export const FORECAST_TYPES: ProductType[] = [
  { id: "zone-forecast", name: "Zone Forecast", code: "ZFP" },
  { id: "short-term-forecast", name: "Short-Term Forecast", code: "NOW" },
  { id: "forecast-discussion", name: "Forecast Discussion", code: "AFD" },
  { id: "snowfall-forecast", name: "Snowfall Forecast", code: "SNF" },
  { id: "lake-effect-forecast", name: "Lake-Effect Snow Forecast", code: "LEF" },
  { id: "severe-timing-forecast", name: "Severe Storm Timing Forecast", code: "STF" },
  { id: "marine-forecast", name: "Marine Forecast", code: "MAF" },
  { id: "weekend-forecast", name: "Weekend Forecast", code: "WKF" },
  { id: "school-day-forecast", name: "School Day Forecast", code: "SDF" },
];

/** Display name + severity for an outlook with a risk level. */
export function outlookProduct(typeId: string, riskId: string) {
  const t = OUTLOOK_TYPES.find((o) => o.id === typeId) ?? OUTLOOK_TYPES[0];
  const r = OUTLOOK_RISKS.find((x) => x.id === riskId) ?? OUTLOOK_RISKS[0];
  return {
    name: r.id === "general" ? t.name : `${t.name} — ${r.label.split(" ")[0]} Risk`,
    severity: r.severity,
  };
}
