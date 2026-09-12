// src/utils/gameLogic.ts
import { type Pokemon } from "../types/pokemon";
import { type StatComparison, type ComparisonResult } from "../types/game";

export type { Pokemon, StatComparison, ComparisonResult };

export const getComparison = (
  guess: Pokemon,
  target: Pokemon,
): ComparisonResult => {
  return {
    role: {
      value: guess.role,
      status: guess.role === target.role ? "correct" : "wrong",
    },
    evolves: {
      value: guess.evolves ? "Sí" : "No",
      status: guess.evolves === target.evolves ? "correct" : "wrong",
    },
    has_mega: {
      value: guess.has_mega ? "Sí" : "No",
      status: guess.has_mega === target.has_mega ? "correct" : "wrong",
    },
    evolution_stage: {
      value: guess.evolution_stage,
      status:
        guess.evolution_stage === target.evolution_stage
          ? "correct"
          : guess.evolution_stage < target.evolution_stage
            ? "higher"
            : "lower",
    },
    release_year: {
      value: guess.release_year,
      status:
        guess.release_year === target.release_year
          ? "correct"
          : guess.release_year < target.release_year
            ? "higher"
            : "lower",
    },
    attack_range: {
      value: guess.attack_range,
      status: guess.attack_range === target.attack_range ? "correct" : "wrong",
    },
  };
};