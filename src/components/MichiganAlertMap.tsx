import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";

export interface CountyAlertInfo {
  county: string; // lowercase county name or marine zone id (e.g., 'lmz', 'lake-michigan')
  event: string;
  rank: number;
  severity?: "extreme" | "severe" | "moderate" | "minor";
  partial?: boolean;
}

export interface AlertPolygon {
  event: string;
  rank: number;
  severity?: "extreme" | "severe" | "moderate" | "minor";
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: any };
  areaDesc?: string;
}

interface Props {
  alertsByCounty: CountyAlertInfo[];
  polygons?: AlertPolygon[];
  width?: number;
  height?: number;
}

interface FC {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id: string;
    properties: { name: string };
    geometry: any;
  }>;
}

// Marine Zones around Michigan (Great Lakes bounds)
const MARINE_ZONES = [
  {
    id: "lake-superior",
    name: "Lake Superior Marine Zone",
    // Coastal marine polygon near Michigan UP shore
    coords: [
      [-90.4, 46.8], [-88.5, 47.5], [-87.0, 47.4], [-85.0, 46.8],
      [-84.6, 46.5], [-85.1, 46.4], [-87.0, 46.5], [-88.4, 46.9],
      [-90.4, 46.8],
    ],
  },
  {
    id: "lake-michigan",
    name: "Lake Michigan Marine Zone",
    // Western Lower Peninsula coast
    coords: [
      [-87.8, 45.8], [-86.0, 45.8], [-86.4, 44.5], [-86.7, 43.2],
      [-86.9, 41.8], [-87.1, 41.8], [-87.0, 43.2], [-86.8, 44.5],
      [-87.8, 45.8],
    ],
  },
  {
    id: "lake-huron",
    name: "Lake Huron Marine Zone",
    // Eastern Lower Peninsula / Saginaw Bay
    coords: [
      [-84.3, 46.0], [-83.4, 45.4], [-82.5, 44.0], [-82.4, 43.0],
      [-82.6, 43.0], [-83.2, 43.9], [-83.9, 44.1], [-84.3, 45.5],
      [-84.3, 46.0],
    ],
  },
  {
    id: "lake-erie",
    name: "Lake Erie & St. Clair Marine Zone",
    // SE Michigan coast
    coords: [
      [-82.7, 42.6], [-82.4, 42.4], [-83.1, 41.8], [-83.5, 41.7],
      [-83.4, 42.0], [-82.9, 42.4], [-82.7, 42.6],
    ],
  },
];

export function resolveAlertColor(event: string, severity?: string): string {
  const ev = (event || "").toLowerCase();
  
  if (ev.includes("forecast")) return "#22c55e"; // Green Forecast
  if (ev.includes("outlook")) return "#3b82f6"; // Blue Outlook
  if (ev.includes("network") || ev.includes("miweather")) return "#8b5cf6"; // Violet Network
  if (ev.includes("emergency") || ev.includes("amber") || ev.includes("civil")) return "#dc2626"; // EAS Emergency Red

  if (severity === "extreme" || ev.includes("tornado warning") || ev.includes("flash flood")) {
    return "#ef4444"; // Red
  }
  if (severity === "severe" || ev.includes("severe thunderstorm") || ev.includes("winter storm")) {
    return "#f97316"; // Orange
  }
  if (severity === "moderate" || ev.includes("watch") || ev.includes("advisory")) {
    return "#eab308"; // Amber
  }
  if (severity === "minor" || ev.includes("marine") || ev.includes("gale") || ev.includes("craft")) {
    return "#06b6d4"; // Cyan
  }
  if (ev.includes("outlook")) {
    return "#3b82f6"; // Blue Outlook
  }

  return "#64748b"; // Neutral Slate
}

export function MichiganAlertMap({ alertsByCounty, polygons = [], width = 520, height = 560 }: Props) {
  const [geo, setGeo] = useState<FC | null>(null);
  const [hover, setHover] = useState<{ name: string; event?: string; partial?: boolean; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/geo/mi-counties.geojson")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setGeo(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const countyMap = useMemo(() => {
    const m = new Map<string, CountyAlertInfo>();
    for (const a of alertsByCounty) {
      const k = a.county.toLowerCase();
      const prev = m.get(k);
      if (!prev || a.rank > prev.rank) {
        m.set(k, { ...a, partial: a.partial && (!prev || prev.partial !== false) });
      } else if (prev && !a.partial) {
        m.set(k, { ...prev, partial: false });
      }
    }
    return m;
  }, [alertsByCounty]);

  const projection = useMemo(() => {
    if (!geo) return null;
    return geoMercator().fitSize([width, height], geo as any);
  }, [geo, width, height]);

  const path = useMemo(() => (projection ? geoPath(projection) : null), [projection]);

  if (!geo || !path || !projection) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 grid place-items-center" style={{ minHeight: height }}>
        <p className="text-xs font-mono text-muted-foreground animate-pulse">Loading MIWeather radar & county zones…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 relative shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Michigan Counties & Great Lakes Marine Zones
          </h3>
          <p className="text-[10px] text-muted-foreground">Real-time severity color mapping</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">
          MIWeather Live
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="MIWeather Alert Map">
          <defs>
            <pattern id="partial-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="currentColor" fillOpacity="0.35" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeWidth="1.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Great Lakes Marine Zones Layer */}
          {MARINE_ZONES.map((zone) => {
            const info = countyMap.get(zone.id) || countyMap.get(zone.name.toLowerCase());
            const d = path({
              type: "Feature",
              properties: { name: zone.name },
              geometry: { type: "Polygon", coordinates: [zone.coords] },
            } as any);

            const fillColor = info ? resolveAlertColor(info.event, info.severity) : "rgba(6, 182, 212, 0.08)";
            const strokeColor = info ? resolveAlertColor(info.event, info.severity) : "rgba(6, 182, 212, 0.3)";

            return (
              <path
                key={zone.id}
                d={d || ""}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={info ? 1.5 : 0.8}
                strokeDasharray={info ? undefined : "3 3"}
                onMouseMove={(e) => {
                  const r = (e.currentTarget.ownerSVGElement!).getBoundingClientRect();
                  setHover({ name: zone.name, event: info?.event, x: e.clientX - r.left, y: e.clientY - r.top });
                }}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Counties Layer */}
          {geo.features.map((f) => {
            const name = f.properties.name;
            const info = countyMap.get(name.toLowerCase());
            const baseFill = info ? resolveAlertColor(info.event, info.severity) : "var(--card)";
            const fill = info?.partial ? "var(--card)" : baseFill;

            return (
              <path
                key={f.id}
                d={path(f as any) || ""}
                fill={fill}
                stroke={info ? "#000" : "var(--foreground)"}
                strokeOpacity={info ? 1 : 0.3}
                strokeWidth={info ? 0.75 : 0.45}
                onMouseMove={(e) => {
                  const r = (e.currentTarget.ownerSVGElement!).getBoundingClientRect();
                  setHover({ name: `${name} County`, event: info?.event, partial: info?.partial, x: e.clientX - r.left, y: e.clientY - r.top });
                }}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Alert Polygons */}
          {polygons.map((p, i) => {
            const feature = { type: "Feature", geometry: p.geometry, properties: {} } as any;
            const d = path(feature);
            if (!d) return null;
            const c = resolveAlertColor(p.event, p.severity);
            return (
              <path
                key={`poly-${i}`}
                d={d}
                fill={c}
                fillOpacity={0.6}
                stroke="#000"
                strokeWidth={1}
                pointerEvents="none"
              />
            );
          })}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-xl border border-violet-500/40 bg-popover/95 p-2.5 text-xs shadow-2xl backdrop-blur-md"
            style={{ left: Math.min(hover.x + 10, width - 200), top: Math.max(hover.y - 35, 0) }}
          >
            <div className="font-bold text-foreground">{hover.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {hover.event ? hover.event : "No active warnings"}
            </div>
          </div>
        )}
      </div>

      {/* Severity Legend */}
      <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Extreme / Warning
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" /> Severe / Watch
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" /> Moderate / Advisory
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" /> Marine / Coastal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" /> MIWeather Network
        </span>
      </div>
    </div>
  );
}
