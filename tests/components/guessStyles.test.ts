import { describe, it, expect } from "vitest";
import { getBoxStyle } from "../../src/components/game/guessStyles";

describe("getBoxStyle", () => {
  it("returns emerald glass styling for correct status", () => {
    const style = getBoxStyle("correct");
    expect(style).toContain("emerald");
    expect(style).toContain("backdrop-blur");
  });

  it("returns rose glass styling for wrong status", () => {
    const style = getBoxStyle("wrong");
    expect(style).toContain("rose");
    expect(style).toContain("backdrop-blur");
  });

  it("returns amber glass styling with indicator glow for higher and lower statuses", () => {
    const higherStyle = getBoxStyle("higher");
    const lowerStyle = getBoxStyle("lower");
    expect(higherStyle).toContain("amber");
    expect(higherStyle).toContain("backdrop-blur");
    expect(lowerStyle).toContain("amber");
    expect(lowerStyle).toContain("backdrop-blur");
  });
});
