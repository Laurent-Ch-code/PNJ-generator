import { Routes, provideRouter } from '@angular/router';
import { UniversesListComponent } from './features/univers/univers-list/univers-list.component';
import { UniverseEditComponent } from './features/univers/univers-edit/univers-edit.component';
import { UniverseDetailComponent } from './features/univers/universe-detail/universe-detail.component';

export const routes: Routes = [
  { path: 'universes/new', component: UniverseEditComponent },
  { path: 'universes/:id/edit', component: UniverseEditComponent },
  { path: 'universes/:id', component: UniverseDetailComponent },
  { path: 'universes', component: UniversesListComponent },
  { path: '', redirectTo: '/universes', pathMatch: 'full' }
];
