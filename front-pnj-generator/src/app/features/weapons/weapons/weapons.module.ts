// weapons.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WEAPONS_ROUTES } from '../weapons.routes';
import { WeaponsShellComponent } from '../weapons-shell/weapons-shell.component';
import { WeaponsListComponent } from '../weapons-list/weapons-list.component';
import { WeaponsEditComponent } from '../weapons-edit/weapons-edit.component';
import { WeaponsCardComponent } from '../weapons-card/weapons-card.component';

// Si tu veux utiliser le standalone WeaponsShell, tu peux juste l'importer dans les routes
// Mais tu peux aussi le déclarer ici si tu ne veux pas standalone

@NgModule({
  //declarations: [WeaponsListComponent, WeaponsEditComponent, WeaponsCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(WEAPONS_ROUTES),
    WeaponsShellComponent,
    WeaponsListComponent,
    WeaponsEditComponent,
    WeaponsCardComponent
  ]
})
export class WeaponsModule { }
