/**
 * ROUTES DES UNIVERS
 * 
 * Ce fichier définit les routes principales pour la gestion des univers.
 * Les univers sont le point d'entrée principal de l'application.
 * Chaque univers peut contenir des features (weapons, equipments, etc.)
 */

import { Routes } from '@angular/router';
import { UniversesListComponent } from './univers-list/univers-list.component';
import { UniverseEditComponent } from './univers-edit/univers-edit.component';
import { UniverseDetailComponent } from './universe-detail/universe-detail.component';
import { universeContextGuard } from '../../guard/universe-context.guard';

export const UNIVERSES_ROUTES: Routes = [
  // Route: /universes
  // Affiche la liste de tous les univers
  {
    path: '',
    component: UniversesListComponent
  },

  // Route: /universes/new
  // Formulaire de création d'un nouvel univers
  {
    path: 'new',
    component: UniverseEditComponent
  },

  // Route: /universes/:universeId/edit
  // Formulaire d'édition d'un univers existant
  {
    path: ':universeId/edit',
    component: UniverseEditComponent
  },

  // Route: /universes/:universeId
  // Détail d'un univers avec ses features (weapons, equipments, etc.)
  {
    path: ':universeId',
    component: UniverseDetailComponent,
    canActivate: [universeContextGuard], // ← LE GUARD S'APPLIQUE ICI !
    children: [
      /**
       * IMPORTANT : On utilise loadChildren au lieu de loadComponent
       * 
       * Pourquoi ?
       * - loadChildren charge un fichier de routes complet (weapons.routes.ts)
       * - Ça permet à chaque feature de gérer ses propres routes de manière autonome
       * - Plus maintenable : si tu veux ajouter une route dans weapons, 
       *   tu modifies juste weapons.routes.ts, pas ce fichier
       * 
       * Structure finale des URLs :
       * /universes/:universeId/weapons           <- Liste des armes
       * /universes/:universeId/weapons/new       <- Créer une arme
       * /universes/:universeId/weapons/:id/edit  <- Éditer une arme
       * 
       * LE GUARD universeContextGuard :
       * - S'exécute UNE SEULE FOIS quand on entre dans /universes/:universeId
       * - Extrait automatiquement :universeId de l'URL
       * - Le met dans UniverseContextService
       * - Tous les composants enfants (weapons, equipments, etc.) peuvent alors
       *   récupérer universeId via this.universeContext.requireCurrentUniverseId()
       */
      {
        path: 'weapons',
        loadChildren: () => import('../weapons/weapons.routes').then(m => m.WEAPONS_ROUTES)
      },
      {
        path: 'equipments',
        loadChildren: () => import('../equipment/equipment.routes').then(m => m.EQUIPMENT_ROUTES)
      },
      {
        path: 'protections',
        loadChildren: () => import('../protections/protections.routes').then(m => m.PROTECTIONS_ROUTES)
      },
      // {
      //   path: 'skills',
      //   loadChildren: () => import('../skills/skills.routes').then(m => m.SKILLS_ROUTES)
      // },
    ]
  }
];
