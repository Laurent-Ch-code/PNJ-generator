import { FeatureModels } from '../models/feature.models';

export const UNIVERSES_FEATURE: FeatureModels[] = [
  {
    key: 'weapons',
    title: 'Armes',
    description: 'Gérez les armes disponibles dans cet univers.',
    route: 'weapons',
    icon: 'bi-hammer', // ou 'bi-gear-fill' ou 'bi-crosshair'
    enabled: true
  },
  {
    key: 'equipments',
    title: 'Équipements',
    description: 'Gérez les équipements disponibles dans cet univers.',
    route: 'equipments',
    icon: 'bi-backpack', // ou 'bi-box-seam'
    enabled: true
  },
  {
    key: 'protections',
    title: 'Protections',
    description: 'Gérez les armures et protections.',
    route: 'protections',
    icon: 'bi-shield-fill', // ou 'bi-shield-check'
    enabled: true
  },
  {
    key: 'characteristics',
    title: 'Caractéristiques',
    description: 'Gérez les caractéristiques (Force, Agilité...).',
    route: 'characteristics',
    icon: 'bi-heart-pulse', // ou 'bi-speedometer2' ou 'bi-graph-up'
    enabled: true
  },
  {
    key: 'skills',
    title: 'Compétences',
    description: 'Gérez les compétences (Tir, Combat...).',
    route: 'skills',
    icon: 'bi-bullseye', // ou 'bi-star-fill' ou 'bi-award'
    enabled: true
  },
  {
    key: 'traits',
    title: 'Traits',
    description: 'Gérez les traits uniques de vos PNJs (Résistance au froid, vulnérable au soleil...).',
    route: 'traits',
    icon: 'bi-stars', // ou 'bi-emoji-smile' ou 'bi-lightbulb'
    enabled: true
  },
  {
    key: 'identities',
    title: 'Identité',
    description: 'Gérez les identités.',
    route: 'identities',
    icon: 'bi-person-badge', // ou 'bi-emoji-smile' ou 'bi-lightbulb'
    enabled: true
  },
  {
    key: 'npcs',
    title: 'PNJs',
    description: 'Générez et gérez les personnages.',
    route: 'npcs',
    icon: 'bi-people-fill', // ou 'bi-person-badge'
    enabled: true
  }
]

/**
 * Récupérer uniquement les features activées
 * Par défaut, si enabled n'est pas défini, la feature est considérée active
 */
export function getEnabledFeatures(): FeatureModels[] {
  return UNIVERSES_FEATURE.filter(f => f.enabled !== false);
}
