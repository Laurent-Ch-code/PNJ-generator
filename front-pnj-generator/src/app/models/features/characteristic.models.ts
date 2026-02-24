export interface Characteristic {
  id: string;
  universeId: string;
  name: string;
  description: string;

  generationType: CharacteristicGenerationType;

  // Mode DiceCount (ZCorps)
  diceType?: string | null;
  minDice?: number | null;
  maxDice?: number | null;

  // Mode FixedValue (DnD)
  minValue?: number | null;
  maxValue?: number | null;

  // Indique si cette caractéristique a ses propres règles de modificateurs
  // (prioritaires sur les règles globales de l'univers)
  hasModifiers: boolean;
}

export enum CharacteristicGenerationType {
  DiceCount = 0,   // Nombre de dés variable (ZCorps)
  FixedValue = 1   // Valeur fixe générée (DnD)
}

export type CharacteristicList = Characteristic[];
