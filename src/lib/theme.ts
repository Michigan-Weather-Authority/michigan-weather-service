export type ThemeName = "miweather" | "lake" | "sunset" | "prism" | "noir" | "aurora" | "og" | "minimal";
export type ThemeMode = "dark" | "light";

const THEME_KEY = "mwa-theme";
const MODE_KEY = "mwa-mode";

export const THEMES: { id: ThemeName; label: string; desc: string }[] = [
  { id: "miweather", label: "MIWeather", desc: "Lake teal, coral signals, and crisp graphite" },
  { id: "sunset", label: "Sunset", desc: "Warm amber + dusk plum — Space Grotesk + Fira Sans" },
  { id: "lake", label: "Lakefront", desc: "Crisp emerald + graphite — Space Grotesk + Fira Sans" },
  { id: "prism", label: "Prism", desc: "Modern iridescent — Space Grotesk + Inter" },
  { id: "noir", label: "Storm Noir", desc: "Black + gold editorial broadcast" },
  { id: "aurora", label: "Aurora Glass", desc: "Midnight glass with teal/violet aurora" },
  { id: "og", label: "OG Storm Blue", desc: "Original deep blue weather console" },
  { id: "minimal", label: "Minimal", desc: "Modern monochrome with Inter typography" },
];

export const MODES: { id: ThemeMode; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];

const VALID: ThemeName[] = ["miweather", "lake", "sunset", "prism", "noir", "aurora", "og", "minimal"];

export function getTheme(): ThemeName {
  if (typeof window === "undefined") return "miweather";
  try {
    const v = window.localStorage.getItem(THEME_KEY) as ThemeName | null;
    return v && VALID.includes(v) ? v : "miweather";
  } catch { return "miweather"; }
}

export function getMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(MODE_KEY) as ThemeMode | null;
  return v === "light" ? "light" : "dark";
}

export function applyTheme(theme: ThemeName, mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-mode", mode);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {}
  import("./favicon").then(({ updateFavicon }) => updateFavicon(theme, mode)).catch(() => {});
}


// Inline script string injected pre-paint to avoid FOUC.
export const THEME_BOOT_SCRIPT = `
(function(){try{
  var t=localStorage.getItem('${THEME_KEY}')||'miweather';
  if(!localStorage.getItem('miweather-brand-introduced')){
    t='miweather';
    localStorage.setItem('${THEME_KEY}',t);
    localStorage.setItem('miweather-brand-introduced','1');
  }
  if(['miweather','lake','sunset','prism','noir','aurora','og','minimal'].indexOf(t)===-1)t='miweather';
  var m=localStorage.getItem('${MODE_KEY}')||'dark';
  document.documentElement.setAttribute('data-theme',t);
  document.documentElement.setAttribute('data-mode',m);
}catch(e){
  document.documentElement.setAttribute('data-theme','miweather');
  document.documentElement.setAttribute('data-mode','dark');
}})();
`;
