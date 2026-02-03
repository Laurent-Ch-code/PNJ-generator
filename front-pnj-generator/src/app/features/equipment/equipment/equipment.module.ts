import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EQUIPMENT_ROUTES } from '../equipment.routes';
import { EquipmentShellComponent } from '../equipment-shell/equipment-shell.component';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';
import { EquipmentEditComponent } from '../equipment-edit/equipment-edit.component';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(EQUIPMENT_ROUTES),
    EquipmentShellComponent,
    EquipmentListComponent,
    EquipmentEditComponent,
    EquipmentCardComponent
  ]
})
export class EquipmentModule { }
