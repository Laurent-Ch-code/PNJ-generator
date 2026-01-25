export interface Universe {
  id: string;
  name: string;
  era: string;
  description: string;
  diceRule: string;
}

export type UniversesList = Universe[];
