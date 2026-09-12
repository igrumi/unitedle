import { type Pokemon } from "./pokemon";

export interface StatComparison {
  value: string | number;
  status: "correct" | "wrong" | "higher" | "lower";
}

export interface ComparisonResult {
  role: StatComparison;
  evolves: StatComparison;
  has_mega: StatComparison;
  evolution_stage: StatComparison;
  release_year: StatComparison;
  attack_range: StatComparison;
}

export interface GuessRow {
  rowId: number;
  pokemon: Pokemon;
  stats: ComparisonResult;
  isCorrect: boolean;
}

export const STAT_COLUMN_KEYS = [
  "role",
  "evolves",
  "has_mega",
  "attack_range",
  "release_year",
  "evolution_stage",
] as const satisfies readonly (keyof ComparisonResult)[];
