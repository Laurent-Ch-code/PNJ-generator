export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: string;
  range?: string;
  description?: string;
  capacity?: number;
  radius?: number;
}

export type WeaponsList = Weapon[];
