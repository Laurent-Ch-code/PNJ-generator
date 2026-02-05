/**
 * ROUTES DES Compétences (skills) - CORRIGÉ
 * 
 * Suppression de la route :skillId car pas de composant détail implémenté
 */

import { Routes } from '@angular/router';
import { SkillsShellComponent } from './skills-shell/skills-shell.component';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { SkillsEditComponent } from './skills-edit/skills-edit.component';
import { SkillsCardComponent } from './skills-card/skills-card.component';

export const PROTECTIONS_ROUTES: Routes = [
  {
    path: '',
    component: SkillsShellComponent,
    children: [
      {
        path: '',
        component: SkillsListComponent
      },
      {
        path: 'new',
        component: SkillsEditComponent
      },
      {
        path: ':skillId/edit',
        component: SkillsEditComponent
      },
      // Route détail commentée jusqu'à création de SkillsDetailComponent
       {
         path: ':skillId',
         component: SkillsCardComponent
       }
    ]
  }
];
