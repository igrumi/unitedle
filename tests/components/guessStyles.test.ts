import { describe, it, expect } from "vitest";
import { getBoxStyle } from "../../src/components/game/guessStyles";

describe("getBoxStyle", () => {
  it("returns solid emerald styling for correct status", () => {
    const style = getBoxStyle("correct");
    expect(style).toContain("bg-emerald-600");
    expect(style).not.toContain("backdrop-blur");
  });

  it("returns solid rose styling for wrong status", () => {
    const style = getBoxStyle("wrong");
    expect(style).toContain("bg-rose-600");
    expect(style).not.toContain("backdrop-blur");
  });

  it("returns solid amber styling for higher and lower statuses", () => {
    const higherStyle = getBoxStyle("higher");
    const lowerStyle = getBoxStyle("lower");
    expect(higherStyle).toContain("bg-amber-500");
    expect(higherStyle).not.toContain("backdrop-blur");
    expect(lowerStyle).toContain("bg-amber-500");
    expect(lowerStyle).not.toContain("backdrop-blur");
  });
});
