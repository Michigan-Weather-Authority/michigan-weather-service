import { describe, expect, it } from "vitest";
import { createIphoneWidget } from "./iphone-widget";

describe("iPhone widget download", () => {
  it("embeds the selected city and coordinates without executing city text", () => {
    const city = 'Detroit "; throw new Error("unsafe")';
    const script = createIphoneWidget({ city, lat: 42.3314, lon: -83.0458 });
    expect(script).toContain(`const place = ${JSON.stringify({ city, lat: 42.3314, lon: -83.0458 })};`);
    expect(script).toContain("Script.setWidget(widget)");
    expect(script).toContain("Saved forecast");
    expect(script).toContain("michigan-weather-auth.lovable.app");
  });
});