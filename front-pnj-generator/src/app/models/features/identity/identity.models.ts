import { AgeCategory, Gender } from './identity.enums';

// DTO envoyé au back pour un fragment (prénom, nom, alias)
// Le back fait le GetOrCreate — on envoie juste le texte
export interface FragmentIdentityDTO {
  value: string;
  universeId: string;
}

// DTO envoyé au back pour une info additionnelle (culture, espèce, alignement, origine)
// Même principe : le back fait le GetOrCreate
export interface AdditionnalInformationDTO {
  value: string;
  universeId: string;
  gender: Gender;
}

// DTO de création d'identité — miroir exact du IdentityCreateDTO C#
export interface IdentityCreateDTO {
  universeId: string;
  gender: Gender;
  firstName?: FragmentIdentityDTO;  // Prénom (optionnel si nom ou alias renseigné)
  name?: FragmentIdentityDTO;       // Nom de famille
  alias?: FragmentIdentityDTO;      // Surnom / alias
  culture?: AdditionnalInformationDTO;
  specie?: AdditionnalInformationDTO;
  alignment?: AdditionnalInformationDTO;
  origin?: AdditionnalInformationDTO;
}

// -------------------------
// Modèles de lecture (réponse du back)
// -------------------------

export interface AdditionnalInformation {
  id: string;
  universeId: string;
  value: string;
}

export interface Culture extends AdditionnalInformation { }
export interface Species extends AdditionnalInformation { }  // Corrigé : était typé comme Culture
export interface Alignment extends AdditionnalInformation { }
export interface Origin extends AdditionnalInformation { }

export interface FragmentIdentity {
  id: string;
  universeId: string;
  value: string;
  gender: Gender;
}

// Modèle complet d'une identité (réponse du back)
export interface Identity {
  id: string;
  universeId: string;
  gender: Gender;
  firstName?: FragmentIdentity;
  name?: FragmentIdentity;
  alias?: FragmentIdentity;
  culture?: Culture;
  species?: Species;
  alignment?: Alignment;
  origin?: Origin;
}

export type IdentitiesList = Identity[];
