/**
 * ROUTES DES IDENTITES
 */
import { Routes } from '@angular/router';
import { IdentitiesShellComponent } from './identities-shell/identities-shell.component';
import { IdentitiesListComponent } from './identities-list/identities-list.component';
import { IdentitiesEditComponent } from './identities-edit/identities-edit.component';

export const IDENTITIES_ROUTES: Routes = [
  {
    path: '',
    component: IdentitiesShellComponent,
    children: [
      {
        path: '',
        component: IdentitiesListComponent
      },
      {
        path: 'new',
        component: IdentitiesEditComponent
      },
      {
        path: ':identityId/edit',
        component: IdentitiesEditComponent
      }
    ]
  }
];
