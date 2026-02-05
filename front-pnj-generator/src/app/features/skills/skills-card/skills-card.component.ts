/**
 * COMPOSANT CARTE DE COMPETENCES
 * Affiche une skill sous forme de carte avec ses stats et actions
 */

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../../models/skill.models';
import { SkillService } from '../../../services/skill.service';
import { UniverseContextService } from '../../../services/universe-context.service';

@Component({
  selector: 'app-skills-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-card.component.html' ,
  styleUrl: './skills-card.component.scss'
})
export class SkillsCardComponent implements OnInit {
  /**
   * skill à afficher dans la carte
   */
  @Input({ required: true }) skill!: Skill;

  /**
   * Événement émis quand la utilisateur veut voir les détails
   * Émet la ID de la skill (string)
   */
  @Output() view = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut éditer la skill
   * Émet la ID de la skill (string)
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut supprimer la skill
   * Émet la ID de la skill (string)
   */
  @Output() delete = new EventEmitter<string>();


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly skillService = inject(SkillService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {

    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.skill == null) {
      var skillId: string | null = this.route.snapshot.paramMap.get('skillId');
      this.skillService.getSkillById(skillId!, this.universeId).subscribe({
        next: (skill) => {
          this.skill = skill;
        },
        error: (error) => { }
      });
    }

  }

  /**
   * Émet la événement de vue avec la ID de la skill
   */
  onView(): void {
    this.view.emit(this.skill.id);
  }

  /**
   * Émet la événement d'édition avec la ID de la skill
   */
  onEdit(): void {
    this.edit.emit(this.skill.id);
  }

  /**
   * Émet la événement de suppression avec la ID de la skill
   * Demande confirmation avant de supprimer
   */
  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.skill.name}" ?`);
    if (confirmed) {
      this.delete.emit(this.skill.id);
    }
  }
}
