
// représente un équipement dans un univers de jeu (vêtement, accessoire, etc.)
export interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  universeId: string;
  bonus?: string;
  malus?: string;
}

export type EquipmentsList = Equipment[];
