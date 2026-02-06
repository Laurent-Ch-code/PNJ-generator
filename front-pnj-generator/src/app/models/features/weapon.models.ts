import { WeaponFireMode } from './weapon-fire-mode.enum';

export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: string;
  range?: string;
  description?: string;
  capacity?: number;
  radius?: number;
  weaponFireMode?: WeaponFireMode; // ✅ CORRIGÉ : correspond au backend
  universeId: string;
}

export type WeaponsList = Weapon[];
