import { describe, expect, it } from "vitest";
import { outlookProduct } from "./outlook-forecast-types";

describe("outlook risk levels", () => {
  it("high risk is extreme", () => {
    expect(outlookProduct("severe-outlook", "high")).toEqual({ name: "Severe Weather Outlook — High Risk", severity: "extreme" });
  });
  it("marginal risk is minor", () => {
    expect(outlookProduct("winter-outlook", "marginal").severity).toBe("minor");
  });
  it("general outlook has no risk suffix", () => {
    expect(outlookProduct("flood-outlook", "general").name).toBe("Flood Outlook");
  });
});
