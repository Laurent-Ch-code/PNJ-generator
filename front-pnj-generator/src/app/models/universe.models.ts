import { ModifierType } from '../models/rules/modifier_rules.models';

export interface Universe {
  id: string;
  name: string;
  era: string;
  description: string;
  diceRule: string;
  hasModifiers: boolean;
  modifierType?: ModifierType | null;
}

export type UniversesList = Universe[];
