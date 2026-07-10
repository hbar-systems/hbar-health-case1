/**
 * UI-only i18n for CASE 1 (Lernwerkzeug / teaching tool).
 *
 * Only chrome, navigation, and microcopy are translated here. The teaching-tree
 * content (vignettes, node text, option labels, conclusions) carries its own
 * de/en variants in cases.ts. Clinical proper nouns (pathogens, antibiotics)
 * stay as-is in both languages.
 *
 * STORAGE_KEY is shared across the whole hbar.health suite so the language
 * choice follows the operator from app to app.
 */

export type Lang = "de" | "en";

const STORAGE_KEY = "hbar-health-lang";

export function getStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en") return "en";
  } catch {
    // SSR or blocked localStorage — fall back
  }
  return "de";
}

export function storeLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export interface Strings {
  // Banner (permanent teaching-only warning)
  bannerStrong: string;
  bannerRest: string;
  // Intro + picker
  intro: string;
  pickerHeading: string;
  // Walker chrome
  otherCase: string;
  pathLabel: string;
  resultLabel: string;
  deadEndLabel: string;
  stepBack: string;
  restart: string;
  // Theme toggle titles
  themeLight: string;
  themeDark: string;
}

const de: Strings = {
  bannerStrong: "Lernwerkzeug — nicht für die Patientenversorgung.",
  bannerRest:
    " Synthetische Lehrfälle, keine Verbindung zu Patientendaten, keine Diagnose realer Patienten.",
  intro:
    "Ein interaktiver Denkbaum: vom Organsystem über das Syndrom und den Erreger bis zur Therapie. Zeigt, wie strukturiertes klinisches Denken aussieht — an erfundenen Lehrfällen.",
  pickerHeading: "Lehrfall wählen",
  otherCase: "Anderer Fall",
  pathLabel: "Pfad:",
  resultLabel: "Ergebnis",
  deadEndLabel: "Sackgasse — Lernhinweis",
  stepBack: "← Schritt zurück",
  restart: "Neu starten",
  themeLight: "Hell",
  themeDark: "Dunkel",
};

const en: Strings = {
  bannerStrong: "Teaching tool — not for patient care.",
  bannerRest:
    " Synthetic teaching cases, no connection to patient data, no diagnosis of real patients.",
  intro:
    "An interactive decision tree: from organ system through syndrome and pathogen to therapy. Shows what structured clinical reasoning looks like — on invented teaching cases.",
  pickerHeading: "Choose a teaching case",
  otherCase: "Other case",
  pathLabel: "Path:",
  resultLabel: "Result",
  deadEndLabel: "Dead end — learning note",
  stepBack: "← Step back",
  restart: "Restart",
  themeLight: "Light",
  themeDark: "Dark",
};

const strings: Record<Lang, Strings> = { de, en };

export function t(lang: Lang): Strings {
  return strings[lang];
}
