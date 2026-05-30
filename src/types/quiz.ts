export interface Question {
  id: number;
  dimension: 'Neurotizismus' | 'Extraversion' | 'Verträglichkeit' | 'Gewissenhaftigkeit' | 'Offenheit';
  direction: 'positive' | 'negative';
  text: string;
}

export type Answers = Record<number, number>;

export interface DimensionScores {
  Neurotizismus: number;
  Extraversion: number;
  Verträglichkeit: number;
  Gewissenhaftigkeit: number;
  Offenheit: number;
}

export interface ArchetypeScores {
  mausig: number;
  atzig: number;
  fotzig: number;
}

export interface ResultProfile {
  name: string;
  scores: ArchetypeScores;
  dimensions: DimensionScores;
  primaryArchetype: 'mausig' | 'atzig' | 'fotzig';
  hybridTitle: string;
  hybridDescription: string;
  colorTheme: {
    primary: string;
    secondary: string;
    border: string;
    bg: string;
    glow: string;
  };
}
