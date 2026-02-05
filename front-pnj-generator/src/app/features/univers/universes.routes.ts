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
    canActivate: [universeContextGuard],
    children: [
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
      {
        path: 'characteristics',
        loadChildren: () => import('../characteristics/characteristics.routes').then(m => m.CHARACTERISTICS_ROUTES)
      },
      {
        path: 'skills',
        loadChildren: () => import('../skills/skills.routes').then(m => m.SKILLS_ROUTES)
      },
      {
        path: 'traits',
        loadChildren: () => import('../traits/traits.routes').then(m => m.TRAITS_ROUTES)
      },
    ]
  }
];
