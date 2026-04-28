// src/utils/gameLogic.ts

export interface Pokemon {
  id: number;
  name: string;
  role: string;
  image_url: string;
  evolves: boolean;
  has_mega: boolean;
  evolution_stage: number;
  release_year: number;
  attack_range: 'Cuerpo a cuerpo' | 'Distancia';
}

export interface StatComparison {
  value: string | number;
  status: 'correct' | 'wrong' | 'higher' | 'lower';
}

export interface ComparisonResult {
  role: StatComparison;
  evolves: StatComparison;
  has_mega: StatComparison;
  evolution_stage: StatComparison;
  release_year: StatComparison;
  attack_range: StatComparison;
}

// Este es el Pokémon del día que obtendrías de Supabase
export const TARGET_POKEMON: Pokemon = {
  id: 13,
  name: 'CHARIZARD',
  role: 'Equilibrado',
  image_url: '...',
  evolves: true,
  has_mega: true,
  evolution_stage: 3,
  release_year: 2021,
  attack_range: 'Cuerpo a cuerpo'
};

export const getComparison = (guess: Pokemon, target: Pokemon): ComparisonResult => {
  return {
    role: { value: guess.role, status: guess.role === target.role ? 'correct' : 'wrong' },
    evolves: { value: guess.evolves ? 'Sí' : 'No', status: (guess.evolves === target.evolves) ? 'correct' : 'wrong' },
    has_mega: { value: guess.has_mega ? 'Sí' : 'No', status: (guess.has_mega === target.has_mega) ? 'correct' : 'wrong' },
    evolution_stage: { value: guess.evolution_stage, status: guess.evolution_stage === target.evolution_stage ? 'correct' : (guess.evolution_stage < target.evolution_stage ? 'higher' : 'lower') },
    release_year: { value: guess.release_year, status: guess.release_year === target.release_year ? 'correct' : (guess.release_year < target.release_year ? 'higher' : 'lower') },
    attack_range: { value: guess.attack_range, status: guess.attack_range === target.attack_range ? 'correct' : 'wrong' }
  };
};