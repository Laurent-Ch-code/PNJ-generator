/**
 * Genre (utilisé pour Identity et IdentityPreset)
 */
export enum Gender {
  Male = 0,      // Masculin
  Female = 1,    // Féminin
  Neutral = 2    // Neutre/Non-binaire
}

/**
 * Catégorie d'âge (calculée côté backend, pas stockée en BDD)
 */
export enum AgeCategory {
  Child = 0,       // 0-12 ans
  Teenager = 1,    // 13-17 ans
  YoungAdult = 2,  // 18-25 ans
  Adult = 3,       // 26-50 ans
  MiddleAge = 4,   // 51-65 ans
  Elderly = 5      // 66+ ans
}
