/**
 * MODÈLES TYPESCRIPT POUR LES COMPÉTENCES
 * Correspond aux modèles C# du backend
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
  relatedCharacteristic?: string;
  bonus?: string;
  malus?: string;
  prerequisites?: string;
  universeId: string;
}

export type SkillList = Skill[];
