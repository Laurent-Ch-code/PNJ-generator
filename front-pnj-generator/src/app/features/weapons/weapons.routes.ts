/**
 * ROUTES DES WEAPONS (ARMES) - CORRIGÉ
 * 
 * Suppression de la route :weaponId car pas de composant détail implémenté
 */

import { Routes } from '@angular/router';
import { WeaponsShellComponent } from './weapons-shell/weapons-shell.component';
import { WeaponsListComponent } from './weapons-list/weapons-list.component';
import { WeaponsEditComponent } from './weapons-edit/weapons-edit.component';
import { WeaponsCardComponent } from './weapons-card/weapons-card.component';

export const WEAPONS_ROUTES: Routes = [
  {
    path: '',
    component: WeaponsShellComponent,
    children: [
      {
        path: '',
        component: WeaponsListComponent
      },
      {
        path: 'new',
        component: WeaponsEditComponent
      },
      {
        path: ':weaponId/edit',
        component: WeaponsEditComponent
      }
    ]
  }
];
