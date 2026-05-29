import { type Pokemon, type ComparisonResult } from "../../utils/gameLogic";

export interface GuessRow {
  rowId: number;
  pokemon: Pokemon;
  stats: ComparisonResult;
}

export const STAT_COLUMN_KEYS = [
  "role",
  "evolves",
  "has_mega",
  "attack_range",
  "release_year",
  "evolution_stage",
] as const satisfies readonly (keyof ComparisonResult)[];
