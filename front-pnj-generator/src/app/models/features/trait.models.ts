/**
 * MODÈLES TYPESCRIPT POUR LES TRAITS
 * Correspond aux modèles C# du backend
 */

export interface Trait {
  id: string;
  name: string;
  type: string;
  effect: string;
  description: string;
  prerequisites?: string;
  universeId: string;
}

export type TraitList = Trait[];
