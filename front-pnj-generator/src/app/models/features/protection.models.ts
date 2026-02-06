/**
 * MODÈLES TYPESCRIPT POUR LES PROTECTIONS
 * Correspond aux modèles C# du backend
 */

export interface Protection {
  id: string;
  name: string;
  type: string;
  armorRating: string;
  material: string;
  weight: string;
  description: string;
  universeId: string;
}

export type ProtectionList = Protection[];
