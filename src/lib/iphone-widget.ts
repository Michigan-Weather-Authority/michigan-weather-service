export interface WidgetLocation { city: string; lat: number; lon: number }

// Scriptable runs this on the iPhone, not in the website or server runtime.
export function createIphoneWidget(location: WidgetLocation): string {
  return `// Michigan Weather Service — iPhone widget
// Install in Scriptable. iOS controls background refresh timing.
const place = ${JSON.stringify(location)};
const site = "https://michigan-weather-auth.lovable.app";
const fm = FileManager.local();
const cache = fm.joinPath(fm.documentsDirectory(), "mws-weather-" + place.lat + "-" + place.lon + ".json");
const widget = new ListWidget();
widget.setPadding(16, 16, 16, 16);
widget.backgroundColor = Color.dynamic(new Color("F7FAF8"), new Color("17221E"));
const ink = Color.dynamic(new Color("1C3026"), new Color("F2F8F5"));
const muted = Color.dynamic(new Color("576A60"), new Color("AAC3B6"));
const green = Color.dynamic(new Color("167B59"), new Color("69D6AC"));
widget.url = site;
widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000);
function label(parent, text, font, color) {
  const item = parent.addText(String(text)); item.font = font; item.textColor = color; item.lineLimit = 1; item.minimumScaleFactor = 0.6; return item;
}
let data, stale = false;
try {
  const req = new Request("https://api.open-meteo.com/v1/forecast?latitude=" + place.lat + "&longitude=" + place.lon + "&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FDetroit&forecast_days=1");
  req.timeoutInterval = 15;
  const raw = await req.loadJSON();
  if (!raw.current || !raw.daily) throw new Error("Weather unavailable");
  data = { temperature: raw.current.temperature_2m, feels: raw.current.apparent_temperature, code: raw.current.weather_code, high: raw.daily.temperature_2m_max[0], low: raw.daily.temperature_2m_min[0], updated: Date.now() };
  fm.writeString(cache, JSON.stringify(data));
} catch (error) {
  stale = true;
  try { if (fm.fileExists(cache)) data = JSON.parse(fm.readString(cache)); } catch (_) {}
}
const top = widget.addStack(); top.centerAlignContent();
label(top, "MWS", Font.boldSystemFont(11), green); top.addSpacer();
const icon = SFSymbol.named(!data ? "cloud" : data.code >= 95 ? "cloud.bolt.rain.fill" : data.code >= 71 && data.code <= 77 ? "cloud.snow.fill" : data.code >= 51 ? "cloud.rain.fill" : data.code >= 45 ? "cloud.fog.fill" : data.code > 0 ? "cloud.fill" : "sun.max.fill");
const image = top.addImage(icon.image); image.imageSize = new Size(22,22); image.tintColor = green;
widget.addSpacer(10);
label(widget, place.city + ", MI", Font.semiboldSystemFont(14), ink);
if (data) {
  label(widget, Math.round(data.temperature) + "°", Font.mediumSystemFont(config.widgetFamily === "small" ? 42 : 48), ink);
  label(widget, "Feels " + Math.round(data.feels) + "° · H " + Math.round(data.high) + "°  L " + Math.round(data.low) + "°", Font.systemFont(12), muted);
  widget.addSpacer();
  const time = new Date(data.updated).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Detroit" });
  label(widget, (stale ? "Saved forecast · " : "Updated ") + time + " ET", Font.systemFont(10), muted);
} else {
  widget.addSpacer(8);
  label(widget, "Weather unavailable", Font.systemFont(14), ink);
  label(widget, "Tap to open MWS", Font.systemFont(11), muted);
}
Script.setWidget(widget);
if (!config.runsInWidget) await widget.presentMedium();
Script.complete();
`;
}