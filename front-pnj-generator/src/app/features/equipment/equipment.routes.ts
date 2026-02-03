import { Routes } from '@angular/router';
import { EquipmentShellComponent } from './equipment-shell/equipment-shell.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { EquipmentCardComponent } from './equipment-card/equipment-card.component';

export const EQUIPMENT_ROUTES: Routes = [
  {
    path: '',
    component: EquipmentShellComponent,
    children: [
      { path: '', component: EquipmentListComponent },
      { path: 'new', component: EquipmentEditComponent },
      { path: ':id/edit', component: EquipmentEditComponent },
      { path: ':id', component: EquipmentCardComponent }
    ]
  }
];
