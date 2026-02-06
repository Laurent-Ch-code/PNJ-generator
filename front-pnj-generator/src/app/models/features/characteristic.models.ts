/**
 * MODÈLES TYPESCRIPT POUR LES CARACTÉRISTIQUES
 * Correspond aux modèles C# du backend
 */

export interface Characteristic {
  id: string;
  name: string;
  value: string;
  modifier?: string;
  description: string;
  universeId: string;
}

export type CharacteristicList = Characteristic[];
