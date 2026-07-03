/**
 * CASE 1 — synthetic teaching cases as decision trees.
 *
 * Bug -> drug reasoning: organ system -> syndrome -> pathogen -> resistance ->
 * therapy. Every case, name, and value here is invented for teaching. Distractor
 * options lead to short "why not" leaves so the tree teaches, not just quizzes.
 *
 * This is a LEARNING tool. Nothing here is a recommendation for a real patient.
 */

export interface Option {
  label: string;
  to: string;
  correct?: boolean;
}

export interface Node {
  id: string;
  /** The question or the vignette step. */
  text: string;
  /** Present for decision nodes. */
  options?: Option[];
  /** Present for leaves — the teaching takeaway. */
  conclusion?: string;
  /** A leaf that is a dead-end distractor (offer "zurück"), vs. a final answer. */
  deadEnd?: boolean;
}

export interface TeachingCase {
  id: string;
  title: string;
  vignette: string;
  rootId: string;
  nodes: Record<string, Node>;
}

const postInfluenza: TeachingCase = {
  id: "post-influenza",
  title: "Fieber & Husten nach Influenza",
  vignette:
    "Synthetischer Lehrfall. 74-jährige Patientin, 5 Tage nach durchgemachter Influenza erneut hohes Fieber, produktiver Husten mit gelbem Auswurf, rechtsbasale Rasselgeräusche, CRP deutlich erhöht.",
  rootId: "organ",
  nodes: {
    organ: {
      id: "organ",
      text: "Schritt 1 — Welches Organsystem steht im Vordergrund?",
      options: [
        { label: "Atemwege / Lunge", to: "syndrome", correct: true },
        { label: "Harnwege", to: "organ-harn" },
        { label: "Zentrales Nervensystem", to: "organ-zns" },
      ],
    },
    "organ-harn": {
      id: "organ-harn",
      text: "Harnwege",
      deadEnd: true,
      conclusion:
        "Passt nicht: Husten, Auswurf und rechtsbasale Rasselgeräusche verweisen auf die Atemwege, nicht auf die Harnwege. Zurück und erneut wählen.",
    },
    "organ-zns": {
      id: "organ-zns",
      text: "ZNS",
      deadEnd: true,
      conclusion:
        "Passt nicht: Keine neurologischen Zeichen (Meningismus, Vigilanzstörung). Die Klinik ist pulmonal. Zurück und erneut wählen.",
    },
    syndrome: {
      id: "syndrome",
      text: "Schritt 2 — Welches Syndrom ist bei bakterieller Superinfektion nach Influenza am wahrscheinlichsten?",
      options: [
        { label: "Sekundäre bakterielle Pneumonie", to: "erreger", correct: true },
        { label: "Rein virale akute Bronchitis", to: "syndrome-viral" },
        { label: "Lungenembolie", to: "syndrome-le" },
      ],
    },
    "syndrome-viral": {
      id: "syndrome-viral",
      text: "Virale Bronchitis",
      deadEnd: true,
      conclusion:
        "Unwahrscheinlich: erneutes hohes Fieber, eitriger Auswurf, fokale Rasselgeräusche und hoher CRP sprechen für eine bakterielle Pneumonie, nicht für eine rein virale Bronchitis. Zurück.",
    },
    "syndrome-le": {
      id: "syndrome-le",
      text: "Lungenembolie",
      deadEnd: true,
      conclusion:
        "Immer als Differenzialdiagnose bedenken — hier sprechen aber Fieber, eitriger Auswurf und CRP klar für eine Infektion. Zurück.",
    },
    erreger: {
      id: "erreger",
      text: "Schritt 3 — Welcher Erreger ist bei postinfluenzaler Pneumonie klassisch mitverantwortlich (neben S. pneumoniae, H. influenzae)?",
      options: [
        { label: "Staphylococcus aureus", to: "resistenz", correct: true },
        { label: "Pseudomonas aeruginosa", to: "erreger-pseudo" },
        { label: "Mycoplasma pneumoniae", to: "erreger-myco" },
      ],
    },
    "erreger-pseudo": {
      id: "erreger-pseudo",
      text: "Pseudomonas",
      deadEnd: true,
      conclusion:
        "Eher bei strukturellen Lungenerkrankungen (z. B. Bronchiektasen, Mukoviszidose) oder nosokomial. Nicht der klassische postinfluenzale Erreger. Zurück.",
    },
    "erreger-myco": {
      id: "erreger-myco",
      text: "Mycoplasma",
      deadEnd: true,
      conclusion:
        "Typisch für jüngere Patienten mit eher trockenem Husten und atypischem Verlauf — nicht die klassische postinfluenzale bakterielle Superinfektion. Zurück.",
    },
    resistenz: {
      id: "resistenz",
      text: "Schritt 4 — S. aureus: Welche Resistenzlage bestimmt die Therapie?",
      options: [
        { label: "MSSA — Methicillin-sensibel", to: "mssa", correct: true },
        { label: "MRSA — Methicillin-resistent", to: "mrsa", correct: true },
      ],
    },
    mssa: {
      id: "mssa",
      text: "MSSA",
      conclusion:
        "MSSA → staphylokokkenwirksames Betalaktam: Flucloxacillin bzw. Cefazolin. Lernpunkt: Bei MSSA ist Vancomycin unterlegen und NICHT Mittel der Wahl. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
    },
    mrsa: {
      id: "mrsa",
      text: "MRSA",
      conclusion:
        "MRSA → Betalaktame sind unwirksam. Optionen: Vancomycin oder Linezolid. Lernpunkt: Resistenzlage entscheidet die Substanzklasse. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
    },
  },
};

const cystitis: TeachingCase = {
  id: "cystitis",
  title: "Brennen beim Wasserlassen",
  vignette:
    "Synthetischer Lehrfall. 28-jährige, ansonsten gesunde, nicht schwangere Frau mit Dysurie, Pollakisurie seit 2 Tagen, kein Fieber, keine Flankenschmerzen.",
  rootId: "organ",
  nodes: {
    organ: {
      id: "organ",
      text: "Schritt 1 — Welches Organsystem?",
      options: [
        { label: "Untere Harnwege", to: "syndrome", correct: true },
        { label: "Obere Harnwege (Niere)", to: "organ-pyelo" },
      ],
    },
    "organ-pyelo": {
      id: "organ-pyelo",
      text: "Obere Harnwege",
      deadEnd: true,
      conclusion:
        "Gegen eine Pyelonephritis sprechen fehlendes Fieber und fehlende Flankenschmerzen. Die Klinik ist auf die unteren Harnwege begrenzt. Zurück.",
    },
    syndrome: {
      id: "syndrome",
      text: "Schritt 2 — Welches Syndrom?",
      options: [
        { label: "Unkomplizierte Zystitis", to: "erreger", correct: true },
        { label: "Komplizierte Harnwegsinfektion", to: "syndrome-kompl" },
      ],
    },
    "syndrome-kompl": {
      id: "syndrome-kompl",
      text: "Kompliziert",
      deadEnd: true,
      conclusion:
        "Kompliziert wäre es bei Schwangerschaft, Männern, Katheter, Anomalien oder Fieber. Hier: junge, gesunde, nicht schwangere Frau → unkompliziert. Zurück.",
    },
    erreger: {
      id: "erreger",
      text: "Schritt 3 — Häufigster Erreger?",
      options: [
        { label: "Escherichia coli", to: "therapie", correct: true },
        { label: "Staphylococcus aureus", to: "erreger-staph" },
      ],
    },
    "erreger-staph": {
      id: "erreger-staph",
      text: "S. aureus",
      deadEnd: true,
      conclusion:
        "S. aureus ist ein seltener Harnwegserreger (eher hämatogen). Häufigster Erreger der unkomplizierten Zystitis ist E. coli (~80 %). Zurück.",
    },
    therapie: {
      id: "therapie",
      text: "Schritt 4 — Kalkulierte First-Line-Therapie (Lehrbuch)?",
      options: [
        { label: "Nitrofurantoin oder Fosfomycin", to: "therapie-first", correct: true },
        { label: "Fluorchinolon (z. B. Ciprofloxacin)", to: "therapie-chinolon" },
      ],
    },
    "therapie-first": {
      id: "therapie-first",
      text: "First-Line",
      conclusion:
        "Nitrofurantoin oder Fosfomycin gelten als First-Line bei unkomplizierter Zystitis. Lernpunkt: Reserveantibiotika werden bewusst geschont. (Synthetischer Lehrfall — keine Therapieempfehlung für reale Patienten.)",
    },
    "therapie-chinolon": {
      id: "therapie-chinolon",
      text: "Fluorchinolon",
      deadEnd: true,
      conclusion:
        "Fluorchinolone sind bei unkomplizierter Zystitis KEINE First-Line — sie sollen wegen Nebenwirkungen und Resistenzentwicklung reserviert bleiben. Zurück.",
    },
  },
};

export const CASES: TeachingCase[] = [postInfluenza, cystitis];
