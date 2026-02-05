/**
 * ROUTES DES PROTECTIONS (PROTECTIONS) - CORRIGÉ
 * 
 * Suppression de la route :protectionId car pas de composant détail implémenté
 */

import { Routes } from '@angular/router';
import { ProtectionsShellComponent } from './protections-shell/protections-shell.component';
import { ProtectionsListComponent } from './protections-list/protections-list.component';
import { ProtectionsEditComponent } from './protections-edit/protections-edit.component';
import { ProtectionsCardComponent } from './protections-card/protections-card.component';

export const PROTECTIONS_ROUTES: Routes = [
  {
    path: '',
    component: ProtectionsShellComponent,
    children: [
      {
        path: '',
        component: ProtectionsListComponent
      },
      {
        path: 'new',
        component: ProtectionsEditComponent
      },
      {
        path: ':protectionId/edit',
        component: ProtectionsEditComponent
      }
    ]
  }
];
