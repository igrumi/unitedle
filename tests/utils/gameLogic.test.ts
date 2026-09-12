import { describe, it, expect } from "vitest";
import { getComparison } from "../../src/utils/gameLogic";
import { type Pokemon } from "../../src/types/pokemon";

describe("gameLogic utils", () => {
  const charizard: Pokemon = {
    id: 13,
    name: "CHARIZARD",
    role: "Equilibrado",
    image_url: "https://example.com/charizard.png",
    evolves: true,
    has_mega: true,
    evolution_stage: 3,
    release_year: 2021,
    attack_range: "Cuerpo a cuerpo",
  };

  const pikachu: Pokemon = {
    id: 25,
    name: "PIKACHU",
    role: "Atacante",
    image_url: "https://example.com/pikachu.png",
    evolves: false,
    has_mega: false,
    evolution_stage: 1,
    release_year: 2021,
    attack_range: "Distancia",
  };

  it("returns correct comparison when pokemon matches target completely", () => {
    const result = getComparison(charizard, charizard);
    expect(result.role.status).toBe("correct");
    expect(result.evolves.status).toBe("correct");
    expect(result.has_mega.status).toBe("correct");
    expect(result.evolution_stage.status).toBe("correct");
    expect(result.release_year.status).toBe("correct");
    expect(result.attack_range.status).toBe("correct");
  });

  it("returns wrong and direction comparisons for mismatched stats", () => {
    const result = getComparison(pikachu, charizard);
    expect(result.role.status).toBe("wrong");
    expect(result.evolves.status).toBe("wrong");
    expect(result.has_mega.status).toBe("wrong");
    expect(result.evolution_stage.status).toBe("higher"); // Pikachu is stage 1, Charizard is stage 3 -> needs higher
    expect(result.release_year.status).toBe("correct");
    expect(result.attack_range.status).toBe("wrong");
  });
});
