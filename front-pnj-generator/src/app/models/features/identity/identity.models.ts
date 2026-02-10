import { AgeCategory,Gender } from './identity.enums';

export interface AdditionnalInformation {
  id: string;
  universeId: string;
  name: string;
}

// Représente une culture/origine dans un univers
// Ex: "Japonais", "Américain", "Elfique", "Tribal"
export interface Culture extends AdditionnalInformation { }

// Représente une race/espèce dans un univers
// Ex: "Humain", "Elfe", "Orc", "Zombie", "Chien"
export interface Species extends AdditionnalInformation { }

// Représente un alignement dans un univers
// Ex D&D: "Loyal Bon", "Chaotique Mauvais", "Neutre"
// Ex ZCorps: "Survivant", "Pillard", "Zombie"
export interface Alignment extends AdditionnalInformation { }


export interface Origin extends AdditionnalInformation { }

// Représente un élément d'identité séparé (prénom, nom, ou surnom)
// Ex: "Grok" (prénom Orc), "Cassetête" (nom Orc), "Le Destructeur" (surnom Orc)
export interface Identity {
  id: string;
  universeId: string;
  name: string;
  firstName: string;
  alias: string;
  gender: Gender;          // Genre (obligatoire)
  culture?: Culture;      // Culture (nullable = universel)
  species?: Culture;
  alignment?: Alignment;   // Espèce (nullable = universel)
  origin?: Origin;         // Origine (nullable = universel)
}

export type IdentitiesList = Identity[];
