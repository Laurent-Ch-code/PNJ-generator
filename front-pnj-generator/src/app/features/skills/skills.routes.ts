/**
 * ROUTES DES COMPÉTENCES (SKILLS)
 */

import { Routes } from '@angular/router';
import { SkillsShellComponent } from './skills-shell/skills-shell.component';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { SkillsEditComponent } from './skills-edit/skills-edit.component';
import { SkillsCardComponent } from './skills-card/skills-card.component';

export const SKILLS_ROUTES: Routes = [
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
      }
    ]
  }
];
