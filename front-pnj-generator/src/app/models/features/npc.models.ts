/**
 * MODÈLES TYPESCRIPT POUR LES NPCs
 */

// Modèle principal NPC tel que renvoyé par le back
export interface NPC {
  id: string;
  universeId: string;

  // Snapshots JSON (strings à parser côté front)
  identitySnapshot: string;
  characteristicsSnapshot: string;
  skillsSnapshot: string;
  weaponsSnapshot: string;
  protectionsSnapshot: string;
  equipmentSnapshot: string;
  traitsSnapshot: string;

  hp?: number | null;
  physicalDescription?: string | null;
  gmNotes?: string | null;

  createdAt: string;
}

export type NPCList = NPC[];

// Interfaces pour parser les snapshots JSON
export interface IdentitySnapshot {
  firstName: string;
  lastName: string;
  alias?: string | null;
  age: number;
  gender: string;
  culture?: string | null;
  specie?: string | null;
  alignment?: string | null;
  origin?: string | null;
}

export interface CharacteristicSnapshot {
  name: string;

  // Mode DiceCount
  diceType?: string;
  nbDice?: number;

  // Mode FixedValue
  value?: number;

  modifier?: number | null;
}

export interface SkillSnapshot {
  id: string;
  name: string;
  bonus: string;
}

export interface WeaponSnapshot {
  id: string;
  name: string;
  type: string;
  damage: string;
  range?: string | null;
  capacity?: number | null;
  fireMode?: string | null;
}

export interface ProtectionSnapshot {
  id: string;
  name: string;
  type: string;
  level: string;
  materials?: string | null;
  weight?: number | null;
}

export interface EquipmentSnapshot {
  id: string;
  name: string;
  type: string;
  bonus?: string | null;
  malus?: string | null;
}

export interface TraitSnapshot {
  id: string;
  name: string;
  effect: string;
}
