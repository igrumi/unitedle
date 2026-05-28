import { type Pokemon, type ComparisonResult } from "../../utils/gameLogic";

export interface GuessRow {
  rowId: number;
  pokemon: Pokemon;
  stats: ComparisonResult;
}

export const COLUMN_HEADERS = [
  "Pokémon",
  "Rol",
  "Evo",
  "Mega",
  "Alcance",
  "Año lanzamiento",
  "Etapa evolutiva",
] as const;
