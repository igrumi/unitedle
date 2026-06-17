/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "es" | "en";

const translations = {
  es: {
    metadata: {
      title: "Unitedle - Adivina el Pokémon de Unite diario",
      description:
        "Unitedle es un juego diario para adivinar el Pokémon de Pokémon Unite usando pistas comparativas y ranking con Discord.",
      imageAlt: "Logo de Unitedle",
    },
    app: {
      start: "COMENZAR",
      signInDiscord: "Iniciar sesión con Discord",
      signedInAs: "SESIÓN INICIADA COMO",
      signOut: "CERRAR SESIÓN",
      accountMenu: "Menú de cuenta",
      signOutConfirmTitle: "¿Cerrar sesión?",
      signOutConfirmBody:
        "Tu progreso local seguirá en este dispositivo, pero tendrás que iniciar sesión otra vez para guardar en el ranking.",
      cancel: "Cancelar",
      userFallback: "USUARIO",
      languageLabel: "Idioma",
    },
    game: {
      ranking: "Ver ranking",
      saveStreak: "Guardar racha",
      firstWin: "¡Sé el primero en adivinar el Pokémon de hoy!",
      winsSingular: "¡{count} persona ha adivinado el Pokémon de hoy!",
      winsPlural: "¡{count} personas han adivinado el Pokémon de hoy!",
      inputPlaceholder: "Adivina el Pokémon del día...",
      duplicateGuess: "¡Ya intentaste con este Pokémon!",
    },
    record: {
      loading: "Récord de hoy:",
      empty: "Aún no hay récord hoy - ¡sé el primero!",
      label: "Récord de hoy:",
      attemptSingular: "1 intento",
      attemptPlural: "{count} intentos",
      by: "por",
      anonymous: "Anónimo",
    },
    board: {
      pokemon: "Pokémon",
      exact: "Exacto",
      almost: "¡Casi!",
      almostMessage:
        "Ese Pokémon comparte todas las características del Pokémon de hoy, pero Unitedle necesita que adivines el Pokémon exacto.",
      notExact: "✖",
      role: "Rol",
      evolves: "Evo",
      mega: "Mega",
      range: "Alcance",
      releaseYear: "Año lanzamiento",
      evolutionStage: "Etapa evolutiva",
    },
    legend: {
      correct: "Correcto",
      wrong: "Incorrecto",
      higher: "Más alto",
      lower: "Más bajo",
    },
    leaderboard: {
      loading: "Cargando campeones...",
      title: "Top 5 de Hoy",
      attempts: "Intentos",
      empty: "Aún no hay registros hoy.",
      rankLegend: "Rango Legend",
      rankMaster: "Rango Master",
      rankUltra: "Rango Ultra",
    },
    victory: {
      title: "¡Victoria!",
      todayWas: "Hoy era:",
      guessedIn: "Adivinaste en",
      attempts: "intentos.",
      viewRanking: "VER RANKING DE HOY",
      saveRanking: "Guardar en ranking",
      nextPokemonIn: "Próximo Pokémon en",
      backToResult: "VOLVER A MI RESULTADO",
      fallbackPokemon: "Pokémon del día",
    },
    footer: {
      disclaimer:
        "Unitedle es un proyecto fan-made y no está afiliado con Nintendo, The Pokémon Company, TiMi Studio Group ni Pokémon Unite.",
    },
  },
  en: {
    metadata: {
      title: "Unitedle - Guess the daily Unite Pokémon",
      description:
        "Unitedle is a daily game where you guess the Pokémon Unite character using comparison clues and a Discord leaderboard.",
      imageAlt: "Unitedle logo",
    },
    app: {
      start: "START",
      signInDiscord: "Sign in with Discord",
      signedInAs: "SIGNED IN AS",
      signOut: "SIGN OUT",
      accountMenu: "Account menu",
      signOutConfirmTitle: "Sign out?",
      signOutConfirmBody:
        "Your local progress will stay on this device, but you will need to sign in again to save to the ranking.",
      cancel: "Cancel",
      userFallback: "USER",
      languageLabel: "Language",
    },
    game: {
      ranking: "View ranking",
      saveStreak: "Save streak",
      firstWin: "Be the first to guess today's Pokémon!",
      winsSingular: "{count} person has guessed today's Pokémon!",
      winsPlural: "{count} people have guessed today's Pokémon!",
      inputPlaceholder: "Guess today's Pokémon...",
      duplicateGuess: "You already tried this Pokémon!",
    },
    record: {
      loading: "Today's record:",
      empty: "No record yet today - be the first!",
      label: "Today's record:",
      attemptSingular: "1 attempt",
      attemptPlural: "{count} attempts",
      by: "by",
      anonymous: "Anonymous",
    },
    board: {
      pokemon: "Pokémon",
      exact: "Exact",
      almost: "Close!",
      almostMessage:
        "That Pokémon shares every clue with today's Pokémon, but Unitedle needs the exact Pokémon.",
      notExact: "✖",
      role: "Role",
      evolves: "Evo",
      mega: "Mega",
      range: "Range",
      releaseYear: "Release year",
      evolutionStage: "Evolution stage",
    },
    legend: {
      correct: "Correct",
      wrong: "Wrong",
      higher: "Higher",
      lower: "Lower",
    },
    leaderboard: {
      loading: "Loading champions...",
      title: "Today's Top 5",
      attempts: "Attempts",
      empty: "No records yet today.",
      rankLegend: "Legend rank",
      rankMaster: "Master rank",
      rankUltra: "Ultra rank",
    },
    victory: {
      title: "Victory!",
      todayWas: "Today was:",
      guessedIn: "You guessed it in",
      attempts: "attempts.",
      viewRanking: "VIEW TODAY'S RANKING",
      saveRanking: "Save to ranking",
      nextPokemonIn: "Next Pokémon in",
      backToResult: "BACK TO MY RESULT",
      fallbackPokemon: "daily Pokémon",
    },
    footer: {
      disclaimer:
        "Unitedle is a fan-made project and is not affiliated with Nintendo, The Pokémon Company, TiMi Studio Group, or Pokémon Unite.",
    },
  },
} as const;

type TranslationTree = typeof translations.es;
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type TranslationKey = {
  [K in keyof TranslationTree]: TranslationTree[K] extends Record<string, string>
    ? `${K & string}${DotPrefix<keyof TranslationTree[K] & string>}`
    : K & string;
}[keyof TranslationTree];

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  translateGameValue: (value: string | number) => string | number;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectInitialLanguage(): Language {
  const saved = localStorage.getItem("unitedle_language");
  if (saved === "es" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function getTranslation(language: Language, key: TranslationKey) {
  const [section, item] = key.split(".") as [
    keyof TranslationTree,
    string | undefined,
  ];
  const value = item
    ? (translations[language][section] as Record<string, string>)[item]
    : undefined;
  return value ?? key;
}

function setMetaTag(selector: string, attribute: "content" | "href", value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function applyMetadata(language: Language) {
  const { title, description } = translations[language].metadata;
  document.documentElement.lang = language;
  document.title = title;
  setMetaTag('meta[name="description"]', "content", description);
  setMetaTag('meta[property="og:title"]', "content", title);
  setMetaTag('meta[property="og:description"]', "content", description);
  setMetaTag('meta[property="og:locale"]', "content", language === "es" ? "es_CL" : "en_US");
  setMetaTag('meta[name="twitter:title"]', "content", title);
  setMetaTag('meta[name="twitter:description"]', "content", description);
}

const englishGameValues: Record<string, string> = {
  Sí: "Yes",
  Si: "Yes",
  No: "No",
  Atacante: "Attacker",
  Ágil: "Speedster",
  Agil: "Speedster",
  Equilibrado: "All-Rounder",
  Defensivo: "Defender",
  Auxiliar: "Supporter",
  Distancia: "Ranged",
  "Cuerpo a cuerpo": "Melee",
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    localStorage.setItem("unitedle_language", language);
    applyMetadata(language);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (
      key: TranslationKey,
      params: Record<string, string | number> = {},
    ) => {
      let text = getTranslation(language, key);
      Object.entries(params).forEach(([param, value]) => {
        text = text.replaceAll(`{${param}}`, String(value));
      });
      return text;
    };

    return {
      language,
      setLanguage: setLanguageState,
      t,
      translateGameValue: (rawValue) => {
        if (language === "es" || typeof rawValue !== "string") return rawValue;
        return englishGameValues[rawValue] ?? rawValue;
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
