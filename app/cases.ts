/**
 * CASE 1 — synthetic teaching cases as decision trees.
 *
 * Bug -> drug reasoning: organ system -> syndrome -> pathogen -> resistance ->
 * therapy. Every case, name, and value here is invented for teaching. Distractor
 * options lead to short "why not" leaves so the tree teaches, not just quizzes.
 *
 * Every user-visible string carries a de/en variant (`L`). Clinical proper nouns
 * (pathogens, antibiotics) stay identical in both languages. The UI resolves the
 * active language via `node.text[lang]` etc.
 *
 * This is a LEARNING tool. Nothing here is a recommendation for a real patient.
 */

import { type Lang } from "./i18n";

/** A localized string: same content, two languages. */
export type L = Record<Lang, string>;

export interface Option {
  label: L;
  to: string;
  correct?: boolean;
}

export interface Node {
  id: string;
  /** The question or the vignette step. */
  text: L;
  /** Present for decision nodes. */
  options?: Option[];
  /** Present for leaves — the teaching takeaway. */
  conclusion?: L;
  /** A leaf that is a dead-end distractor (offer "zurück"), vs. a final answer. */
  deadEnd?: boolean;
}

export interface TeachingCase {
  id: string;
  title: L;
  vignette: L;
  rootId: string;
  nodes: Record<string, Node>;
}

const postInfluenza: TeachingCase = {
  id: "post-influenza",
  title: {
    de: "Fieber & Husten nach Influenza",
    en: "Fever & cough after influenza",
  },
  vignette: {
    de: "Synthetischer Lehrfall. 74-jährige Patientin, 5 Tage nach durchgemachter Influenza erneut hohes Fieber, produktiver Husten mit gelbem Auswurf, rechtsbasale Rasselgeräusche, CRP deutlich erhöht.",
    en: "Synthetic teaching case. 74-year-old female patient, 5 days after recovering from influenza, again high fever, productive cough with yellow sputum, right basal crackles, markedly elevated CRP.",
  },
  rootId: "organ",
  nodes: {
    organ: {
      id: "organ",
      text: {
        de: "Schritt 1 — Welches Organsystem steht im Vordergrund?",
        en: "Step 1 — Which organ system is in the foreground?",
      },
      options: [
        { label: { de: "Atemwege / Lunge", en: "Airways / lung" }, to: "syndrome", correct: true },
        { label: { de: "Harnwege", en: "Urinary tract" }, to: "organ-harn" },
        { label: { de: "Zentrales Nervensystem", en: "Central nervous system" }, to: "organ-zns" },
      ],
    },
    "organ-harn": {
      id: "organ-harn",
      text: { de: "Harnwege", en: "Urinary tract" },
      deadEnd: true,
      conclusion: {
        de: "Passt nicht: Husten, Auswurf und rechtsbasale Rasselgeräusche verweisen auf die Atemwege, nicht auf die Harnwege. Zurück und erneut wählen.",
        en: "Does not fit: cough, sputum and right basal crackles point to the airways, not the urinary tract. Go back and choose again.",
      },
    },
    "organ-zns": {
      id: "organ-zns",
      text: { de: "ZNS", en: "CNS" },
      deadEnd: true,
      conclusion: {
        de: "Passt nicht: Keine neurologischen Zeichen (Meningismus, Vigilanzstörung). Die Klinik ist pulmonal. Zurück und erneut wählen.",
        en: "Does not fit: no neurological signs (meningism, impaired consciousness). The presentation is pulmonary. Go back and choose again.",
      },
    },
    syndrome: {
      id: "syndrome",
      text: {
        de: "Schritt 2 — Welches Syndrom ist bei bakterieller Superinfektion nach Influenza am wahrscheinlichsten?",
        en: "Step 2 — Which syndrome is most likely in a bacterial superinfection after influenza?",
      },
      options: [
        { label: { de: "Sekundäre bakterielle Pneumonie", en: "Secondary bacterial pneumonia" }, to: "erreger", correct: true },
        { label: { de: "Rein virale akute Bronchitis", en: "Purely viral acute bronchitis" }, to: "syndrome-viral" },
        { label: { de: "Lungenembolie", en: "Pulmonary embolism" }, to: "syndrome-le" },
      ],
    },
    "syndrome-viral": {
      id: "syndrome-viral",
      text: { de: "Virale Bronchitis", en: "Viral bronchitis" },
      deadEnd: true,
      conclusion: {
        de: "Unwahrscheinlich: erneutes hohes Fieber, eitriger Auswurf, fokale Rasselgeräusche und hoher CRP sprechen für eine bakterielle Pneumonie, nicht für eine rein virale Bronchitis. Zurück.",
        en: "Unlikely: renewed high fever, purulent sputum, focal crackles and high CRP argue for bacterial pneumonia, not a purely viral bronchitis. Go back.",
      },
    },
    "syndrome-le": {
      id: "syndrome-le",
      text: { de: "Lungenembolie", en: "Pulmonary embolism" },
      deadEnd: true,
      conclusion: {
        de: "Immer als Differenzialdiagnose bedenken — hier sprechen aber Fieber, eitriger Auswurf und CRP klar für eine Infektion. Zurück.",
        en: "Always consider it as a differential — but here fever, purulent sputum and CRP clearly argue for an infection. Go back.",
      },
    },
    erreger: {
      id: "erreger",
      text: {
        de: "Schritt 3 — Welcher Erreger ist bei postinfluenzaler Pneumonie klassisch mitverantwortlich (neben S. pneumoniae, H. influenzae)?",
        en: "Step 3 — Which pathogen is classically co-responsible in post-influenza pneumonia (alongside S. pneumoniae, H. influenzae)?",
      },
      options: [
        { label: { de: "Staphylococcus aureus", en: "Staphylococcus aureus" }, to: "resistenz", correct: true },
        { label: { de: "Pseudomonas aeruginosa", en: "Pseudomonas aeruginosa" }, to: "erreger-pseudo" },
        { label: { de: "Mycoplasma pneumoniae", en: "Mycoplasma pneumoniae" }, to: "erreger-myco" },
      ],
    },
    "erreger-pseudo": {
      id: "erreger-pseudo",
      text: { de: "Pseudomonas", en: "Pseudomonas" },
      deadEnd: true,
      conclusion: {
        de: "Eher bei strukturellen Lungenerkrankungen (z. B. Bronchiektasen, Mukoviszidose) oder nosokomial. Nicht der klassische postinfluenzale Erreger. Zurück.",
        en: "More typical of structural lung disease (e.g. bronchiectasis, cystic fibrosis) or nosocomial settings. Not the classic post-influenza pathogen. Go back.",
      },
    },
    "erreger-myco": {
      id: "erreger-myco",
      text: { de: "Mycoplasma", en: "Mycoplasma" },
      deadEnd: true,
      conclusion: {
        de: "Typisch für jüngere Patienten mit eher trockenem Husten und atypischem Verlauf — nicht die klassische postinfluenzale bakterielle Superinfektion. Zurück.",
        en: "Typical of younger patients with a rather dry cough and atypical course — not the classic post-influenza bacterial superinfection. Go back.",
      },
    },
    resistenz: {
      id: "resistenz",
      text: {
        de: "Schritt 4 — S. aureus: Welche Resistenzlage bestimmt die Therapie?",
        en: "Step 4 — S. aureus: which resistance profile determines the therapy?",
      },
      options: [
        { label: { de: "MSSA — Methicillin-sensibel", en: "MSSA — methicillin-sensitive" }, to: "mssa", correct: true },
        { label: { de: "MRSA — Methicillin-resistent", en: "MRSA — methicillin-resistant" }, to: "mrsa", correct: true },
      ],
    },
    mssa: {
      id: "mssa",
      text: { de: "MSSA", en: "MSSA" },
      conclusion: {
        de: "MSSA → staphylokokkenwirksames Betalaktam: Flucloxacillin bzw. Cefazolin. Lernpunkt: Bei MSSA ist Vancomycin unterlegen und NICHT Mittel der Wahl. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
        en: "MSSA → an anti-staphylococcal beta-lactam: Flucloxacillin or Cefazolin. Teaching point: for MSSA, Vancomycin is inferior and NOT the agent of choice. (Synthetic teaching case — not a therapy recommendation for real patients.)",
      },
    },
    mrsa: {
      id: "mrsa",
      text: { de: "MRSA", en: "MRSA" },
      conclusion: {
        de: "MRSA → Betalaktame sind unwirksam. Optionen: Vancomycin oder Linezolid. Lernpunkt: Resistenzlage entscheidet die Substanzklasse. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
        en: "MRSA → beta-lactams are ineffective. Options: Vancomycin or Linezolid. Teaching point: the resistance profile decides the drug class. (Synthetic teaching case — not a therapy recommendation for real patients.)",
      },
    },
  },
};

const cystitis: TeachingCase = {
  id: "cystitis",
  title: {
    de: "Brennen beim Wasserlassen",
    en: "Burning on urination",
  },
  vignette: {
    de: "Synthetischer Lehrfall. 28-jährige, ansonsten gesunde, nicht schwangere Frau mit Dysurie, Pollakisurie seit 2 Tagen, kein Fieber, keine Flankenschmerzen.",
    en: "Synthetic teaching case. 28-year-old, otherwise healthy, non-pregnant woman with dysuria and pollakiuria for 2 days, no fever, no flank pain.",
  },
  rootId: "organ",
  nodes: {
    organ: {
      id: "organ",
      text: {
        de: "Schritt 1 — Welches Organsystem?",
        en: "Step 1 — Which organ system?",
      },
      options: [
        { label: { de: "Untere Harnwege", en: "Lower urinary tract" }, to: "syndrome", correct: true },
        { label: { de: "Obere Harnwege (Niere)", en: "Upper urinary tract (kidney)" }, to: "organ-pyelo" },
      ],
    },
    "organ-pyelo": {
      id: "organ-pyelo",
      text: { de: "Obere Harnwege", en: "Upper urinary tract" },
      deadEnd: true,
      conclusion: {
        de: "Gegen eine Pyelonephritis sprechen fehlendes Fieber und fehlende Flankenschmerzen. Die Klinik ist auf die unteren Harnwege begrenzt. Zurück.",
        en: "The absence of fever and flank pain argues against pyelonephritis. The presentation is confined to the lower urinary tract. Go back.",
      },
    },
    syndrome: {
      id: "syndrome",
      text: {
        de: "Schritt 2 — Welches Syndrom?",
        en: "Step 2 — Which syndrome?",
      },
      options: [
        { label: { de: "Unkomplizierte Zystitis", en: "Uncomplicated cystitis" }, to: "erreger", correct: true },
        { label: { de: "Komplizierte Harnwegsinfektion", en: "Complicated urinary tract infection" }, to: "syndrome-kompl" },
      ],
    },
    "syndrome-kompl": {
      id: "syndrome-kompl",
      text: { de: "Kompliziert", en: "Complicated" },
      deadEnd: true,
      conclusion: {
        de: "Kompliziert wäre es bei Schwangerschaft, Männern, Katheter, Anomalien oder Fieber. Hier: junge, gesunde, nicht schwangere Frau → unkompliziert. Zurück.",
        en: "It would be complicated with pregnancy, in men, with a catheter, anatomical anomalies or fever. Here: a young, healthy, non-pregnant woman → uncomplicated. Go back.",
      },
    },
    erreger: {
      id: "erreger",
      text: {
        de: "Schritt 3 — Häufigster Erreger?",
        en: "Step 3 — Most common pathogen?",
      },
      options: [
        { label: { de: "Escherichia coli", en: "Escherichia coli" }, to: "therapie", correct: true },
        { label: { de: "Staphylococcus aureus", en: "Staphylococcus aureus" }, to: "erreger-staph" },
      ],
    },
    "erreger-staph": {
      id: "erreger-staph",
      text: { de: "S. aureus", en: "S. aureus" },
      deadEnd: true,
      conclusion: {
        de: "S. aureus ist ein seltener Harnwegserreger (eher hämatogen). Häufigster Erreger der unkomplizierten Zystitis ist E. coli (~80 %). Zurück.",
        en: "S. aureus is a rare urinary pathogen (usually hematogenous). The most common cause of uncomplicated cystitis is E. coli (~80 %). Go back.",
      },
    },
    therapie: {
      id: "therapie",
      text: {
        de: "Schritt 4 — Kalkulierte First-Line-Therapie (Lehrbuch)?",
        en: "Step 4 — Empirical first-line therapy (textbook)?",
      },
      options: [
        { label: { de: "Nitrofurantoin oder Fosfomycin", en: "Nitrofurantoin or Fosfomycin" }, to: "therapie-first", correct: true },
        { label: { de: "Fluorchinolon (z. B. Ciprofloxacin)", en: "Fluoroquinolone (e.g. Ciprofloxacin)" }, to: "therapie-chinolon" },
      ],
    },
    "therapie-first": {
      id: "therapie-first",
      text: { de: "First-Line", en: "First-line" },
      conclusion: {
        de: "Nitrofurantoin oder Fosfomycin gelten als First-Line bei unkomplizierter Zystitis. Lernpunkt: Reserveantibiotika werden bewusst geschont. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
        en: "Nitrofurantoin or Fosfomycin are considered first-line for uncomplicated cystitis. Teaching point: reserve antibiotics are deliberately spared. (Synthetic teaching case — not a therapy recommendation for real patients.)",
      },
    },
    "therapie-chinolon": {
      id: "therapie-chinolon",
      text: { de: "Fluorchinolon", en: "Fluoroquinolone" },
      deadEnd: true,
      conclusion: {
        de: "Fluorchinolone sind bei unkomplizierter Zystitis KEINE First-Line — sie sollen wegen Nebenwirkungen und Resistenzentwicklung reserviert bleiben. Zurück.",
        en: "Fluoroquinolones are NOT first-line for uncomplicated cystitis — they should stay in reserve due to side effects and resistance development. Go back.",
      },
    },
  },
};

export const CASES: TeachingCase[] = [postInfluenza, cystitis];
