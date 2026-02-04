import { FeatureModels } from '../models/feature.models';

export const UNIVERSES_FEATURE: FeatureModels[] = [
  {
    key: 'weapons',
    title: 'Armes',
    description: 'Gérez les armes disponibles dans cet univers.',
    route: 'weapons',
    icon: '⚔️',
    enabled: true
  },
  {
    key: 'equipments',
    title: 'Équipements',
    description: 'Gérez les équipements disponibles dans cet univers.',
    route: 'equipments',
    icon: '🎒',
    enabled: true
  },
  {
    key: 'protections',
    title: 'Protections',
    description: 'Gérez les armures et protections.',
    route: 'protections',
    icon: '🛡️',
    enabled: true // ⚠️ À activer quand prêt
  },
  {
    key: 'characteristics',
    title: 'Caractéristiques',
    description: 'Gérez les caractéristiques (Force, Agilité...).',
    route: 'characteristics',
    icon: '💪',
    enabled: false // ⚠️ Pas encore implémenté
  },
  {
    key: 'skills',
    title: 'Compétences',
    description: 'Gérez les compétences (Tir, Combat...).',
    route: 'skills',
    icon: '🎯',
    enabled: false // ⚠️ Pas encore implémenté
  },
  {
    key: 'traits',
    title: 'Traits',
    description: 'Gérez les traits de personnalité.',
    route: 'traits',
    icon: '✨',
    enabled: false // ⚠️ Pas encore implémenté
  },
  {
    key: 'npcs',
    title: 'PNJs',
    description: 'Générez et gérez les personnages.',
    route: 'npcs',
    icon: '👥',
    enabled: false // ⚠️ Pas encore implémenté
  }
]

/**
 * Récupérer uniquement les features activées
 * Par défaut, si enabled n'est pas défini, la feature est considérée active
 */
export function getEnabledFeatures(): FeatureModels[] {
  return UNIVERSES_FEATURE.filter(f => f.enabled !== false);
}
