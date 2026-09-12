export interface Pokemon {
  id: number;
  name: string;
  role: string;
  image_url: string;
  evolves: boolean;
  has_mega: boolean;
  evolution_stage: number;
  release_year: number;
  attack_range: "Cuerpo a cuerpo" | "Distancia";
}
