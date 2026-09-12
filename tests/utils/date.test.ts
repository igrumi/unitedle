import { describe, it, expect } from "vitest";
import { getChileTodayISO } from "../../src/utils/date";

describe("date utils", () => {
  it("getChileTodayISO returns a valid ISO date format (YYYY-MM-DD)", () => {
    const today = getChileTodayISO();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
