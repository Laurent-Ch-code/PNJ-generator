import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'universes',
    pathMatch: 'full'
  },
  {
    path: 'universes',
    loadChildren: () => import('./features/univers/universes.routes').then(m => m.UNIVERSES_ROUTES)
  }
];
