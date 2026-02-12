// Type de système de modificateurs
export enum ModifierType {
  RangeTable = 'RangeTable',    // D&D : palier min/max → modificateur résultant
  AvailableList = 'AvailableList'  // ZCorps : liste de modificateurs disponibles
}

// Modèle de lecture (réponse du back)
export interface ModifierRules {
  id: string;
  universeId: string;
  characteristicId?: string | null; // null = règle globale à l'univers, sinon spécifique à une caract
  type: ModifierType;

  // Utilisé si type = RangeTable
  // Ex D&D : caract entre rangeMin et rangeMax → modificateur
  rangeMin?: number | null;
  rangeMax?: number | null;
  modifier?: number | null;

  // Utilisé si type = AvailableList
  // Ex ZCorps : valeurs de modificateur disponibles au choix
  availableValue?: number | null;
}

export type ModifierRulesList = ModifierRules[];
