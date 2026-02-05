/**
 * ROUTES DES CARACTÉRISTIQUES (CHARACTERISTICS)
 */

import { Routes } from '@angular/router';
import { CharacteristicsShellComponent } from './characteristics-shell/characteristics-shell.component';
import { CharacteristicsListComponent } from './characteristics-list/characteristics-list.component';
import { CharacteristicsEditComponent } from './characteristics-edit/characteristics-edit.component';
import { CharacteristicsCardComponent } from './characteristics-card/characteristics-card.component';

export const CHARACTERISTICS_ROUTES: Routes = [
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
      {
        path: ':characteristicId',
        component: CharacteristicsCardComponent
      }
    ]
  }
];
