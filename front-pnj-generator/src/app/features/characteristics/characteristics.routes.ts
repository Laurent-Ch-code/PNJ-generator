/**
 * ROUTES DES Caractéristiques (CHARACTERISTICS) - CORRIGÉ
 * 
 * Suppression de la route :characteristicId car pas de composant détail implémenté
 */

import { Routes } from '@angular/router';
import { CharacteristicsShellComponent } from './characteristics-shell/characteristics-shell.component';
import { CharacteristicsListComponent } from './characteristics-list/characteristics-list.component';
import { CharacteristicsEditComponent } from './characteristics-edit/characteristics-edit.component';
import { CharacteristicsCardComponent } from './characteristics-card/characteristics-card.component';

export const PROTECTIONS_ROUTES: Routes = [
  {
    path: '',
    component: CharacteristicsShellComponent,
    children: [
      {
        path: '',
        component: CharacteristicsListComponent
      },
      {
        path: 'new',
        component: CharacteristicsEditComponent
      },
      {
        path: ':characteristicId/edit',
        component: CharacteristicsEditComponent
      },
      // Route détail commentée jusqu'à création de CharacteristicsDetailComponent
       {
         path: ':characteristicId',
         component: CharacteristicsCardComponent
       }
    ]
  }
];
