/**
 * ROUTES DES Compétences (traits) - CORRIGÉ
 * 
 * Suppression de la route :traitId car pas de composant détail implémenté
 */

import { Routes } from '@angular/router';
import { TraitsShellComponent } from './traits-shell/traits-shell.component';
import { TraitsListComponent } from './traits-list/traits-list.component';
import { TraitsEditComponent } from './traits-edit/traits-edit.component';
import { TraitsCardComponent } from './traits-card/traits-card.component';

export const PROTECTIONS_ROUTES: Routes = [
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
      },
      // Route détail commentée jusqu'à création de TraitsDetailComponent
       {
         path: ':traitId',
         component: TraitsCardComponent
       }
    ]
  }
];
