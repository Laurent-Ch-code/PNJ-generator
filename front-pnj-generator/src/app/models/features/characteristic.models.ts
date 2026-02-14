export interface Characteristic {
  id: string;
  universeId: string;
  name: string;
  description: string;

  // Système de dés — ex: "D6", "D20", "D100"
  diceType: string;

  // Nombre de dés minimum à lancer
  minDice: number;

  // Nombre de dés maximum (si null = égal à minDice → jet fixe)
  maxDice?: number | null;

  // Indique si cette caractéristique a ses propres règles de modificateurs
  // (prioritaires sur les règles globales de l'univers)
  hasModifiers: boolean;
}

export type CharacteristicList = Characteristic[];
