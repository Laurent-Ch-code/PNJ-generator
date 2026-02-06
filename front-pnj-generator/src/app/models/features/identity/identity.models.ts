import { AgeCategory,Gender } from './identity.enums';

// Représente une culture/origine dans un univers
// Ex: "Japonais", "Américain", "Elfique", "Tribal"
export interface Culture {
  id: string;
  universeId: string;
  value: string;  // Nom de la culture
}

export type CulturesList = Culture[];

// Représente une race/espèce dans un univers
// Ex: "Humain", "Elfe", "Orc", "Zombie", "Chien"
export interface Species {
  id: string;
  universeId: string;
  value: string;              // Nom de l'espèce
}

export type SpeciesList = Species[];

// Représente un alignement dans un univers
// Ex D&D: "Loyal Bon", "Chaotique Mauvais", "Neutre"
// Ex ZCorps: "Survivant", "Pillard", "Zombie"
export interface Alignment {
  id: string;
  universeId: string;
  name: string;  // Nom de l'alignement
}

export type AlignmentsList = Alignment[];

// Représente un élément d'identité séparé (prénom, nom, ou surnom)
// Ex: "Grok" (prénom Orc), "Cassetête" (nom Orc), "Le Destructeur" (surnom Orc)
export interface Identity {
  id: string;
  universeId: string;
  name: string;
  firstName: string;
  alias: string;
  gender: Gender;          // Genre (obligatoire)
  cultureId?: string;      // Culture (nullable = universel)
  speciesId?: string;      // Espèce (nullable = universel)
}

export type IdentitiesList = Identity[];
