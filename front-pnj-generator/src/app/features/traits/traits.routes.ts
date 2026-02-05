/**
 * ROUTES DES TRAITS
 */

import { Routes } from '@angular/router';
import { TraitsShellComponent } from './traits-shell/traits-shell.component';
import { TraitsListComponent } from './traits-list/traits-list.component';
import { TraitsEditComponent } from './traits-edit/traits-edit.component';
import { TraitsCardComponent } from './traits-card/traits-card.component';

export const TRAITS_ROUTES: Routes = [
  {
    path: '',
    component: TraitsShellComponent,
    children: [
      {
        path: '',
        component: TraitsListComponent
      },
      {
        path: 'new',
        component: TraitsEditComponent
      },
      {
        path: ':traitId/edit',
        component: TraitsEditComponent
      }
    ]
  }
];
