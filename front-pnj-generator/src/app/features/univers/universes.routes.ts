import { Routes, provideRouter } from '@angular/router';
import { UniversesListComponent } from './univers-list/univers-list.component';
import { UniverseEditComponent } from './univers-edit/univers-edit.component';
import { UniverseDetailComponent } from './universe-detail/universe-detail.component';

export const UNIVERSES_ROUTES: Routes = [
  {
    path: '',
    component: UniversesListComponent
  },
  {
    path: 'new',
    component: UniverseEditComponent
  },
  {
    path: ':id/edit',
    component: UniverseEditComponent
  },
  {
    path: ':id',
    component: UniverseDetailComponent,
    children: [
      {
        path: 'weapons',
        // On charge le Shell
        loadComponent: () => import('../weapons/weapons-shell/weapons-shell.component').then(m => m.WeaponsShellComponent),
        // On définit les enfants du Shell directement ici
        children: [
          {
            path: '',
            loadComponent: () => import('../weapons/weapons-list/weapons-list.component').then(m => m.WeaponsListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('../weapons/weapons-edit/weapons-edit.component').then(m => m.WeaponsEditComponent)
          }
        ]
      },
      {
        path: 'equipments',
        loadComponent: () => import('../equipment/equipment-shell/equipment-shell.component').then(m => m.EquipmentShellComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('../equipment/equipment-list/equipment-list.component').then(m => m.EquipmentListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('../equipment/equipment-edit/equipment-edit.component').then(m => m.EquipmentEditComponent)
          }

        ]
      }
    ]
  }
];
