/**
 * COMPOSANT LISTE DES COMPETENCES
 * Affiche toutes les skills d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillsCardComponent } from '../skills-card/skills-card.component';
import { SkillService } from '../../../services/features/skill.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Skill } from '../../../models/features/skill.models';

@Component({
  selector: 'app-skills-list',
  imports: [CommonModule, SkillsCardComponent],
  templateUrl: './skills-list.component.html',
  styleUrl: './skills-list.component.scss'
})
export class SkillsListComponent implements OnInit {
  private readonly skillService = inject(SkillService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  skills: Skill[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadSkills();
  }

  /**
   * Charge la liste des skills depuis le service
   */
  private loadSkills(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.skillService.getSkills(this.universeId).subscribe({
      next: (data) => {
        this.skills = data ?? [];
        console.log('✅ Compétences chargées:', this.skills.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des skills:', err);
        this.errorMessage = 'Impossible de charger les skills';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle skill
   */
  addSkill(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une skill
   * @param id ID de l'skill à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de la skill:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une skill
   * @param id ID de l'skill à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression de la skill:', id);

    this.skillService.deleteSkill(this.universeId,id).subscribe({
      next: () => {
        console.log('✅ Skill supprimée avec succès');
        // Recharger la liste après suppression
        this.loadSkills();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.errorMessage = 'Impossible de supprimer la skill';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param skill Arme
   * @returns L'ID unique de l'skill
   */
  trackBySkillId(index: number, skill: Skill): string {
    return skill.id;
  }
}
