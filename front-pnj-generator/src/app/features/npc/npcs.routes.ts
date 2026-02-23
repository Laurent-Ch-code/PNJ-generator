/**
 * ROUTES DES NPCs
 */
import { Routes } from '@angular/router';
import { NpcsShellComponent } from './npcs-shell/npcs-shell.component';
import { NPCsListComponent } from './npcs-list/npcs-list.component';
import { NPCsEditComponent } from './npcs-edit/npcs-edit.component';

export const NPCS_ROUTES: Routes = [
  {
    path: '',
    component: NpcsShellComponent,
    children: [
      {
        path: '',
        component: NPCsListComponent
      },
      {
        path: ':npcId',
        component: NPCsEditComponent
      }
    ]
  }
];
