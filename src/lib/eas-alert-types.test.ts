import { describe, expect, it } from "vitest";
import { getEasType } from "./eas-alert-types";

describe("command alert type lookup", () => {
  it("recognizes the Outlook alert type", () => {
    expect(getEasType("miweather-outlook")?.code).toBe("OTL");
  });
  it("preserves network notifications", () => {
    expect(getEasType("mwa-network-notification")?.code).toBe("MWA");
  });
  it("preserves standard EAS events", () => {
    expect(getEasType("civil-emergency")?.code).toBe("CEM");
  });
  it("does not recognize unknown event IDs", () => {
    expect(getEasType("not-an-alert")).toBeUndefined();
  });
});