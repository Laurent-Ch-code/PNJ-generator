/**
 * COMPOSANT CARTE DE TRAIT
 * Affiche une trait sous forme de carte avec ses stats et actions
 */

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Trait } from '../../../models/trait.models';
import { TraitService } from '../../../services/trait.service';
import { UniverseContextService } from '../../../services/universe-context.service';

@Component({
  selector: 'app-traits-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traits-card.component.html' ,
  styleUrl: './traits-card.component.scss'
})
export class TraitsCardComponent implements OnInit {
  /**
   * trait à afficher dans la carte
   */
  @Input({ required: true }) trait!: Trait;

  /**
   * Événement émis quand la utilisateur veut voir les détails
   * Émet la ID de la trait (string)
   */
  @Output() view = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut éditer la trait
   * Émet la ID de la trait (string)
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut supprimer la trait
   * Émet la ID de la trait (string)
   */
  @Output() delete = new EventEmitter<string>();


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly traitService = inject(TraitService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {

    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.trait == null) {
      var traitId: string | null = this.route.snapshot.paramMap.get('traitId');
      this.traitService.getTraitById(traitId!, this.universeId).subscribe({
        next: (trait) => {
          this.trait = trait;
        },
        error: (error) => { }
      });
    }

  }

  /**
   * Émet la événement de vue avec la ID de la trait
   */
  onView(): void {
    this.view.emit(this.trait.id);
  }

  /**
   * Émet la événement d'édition avec la ID de la trait
   */
  onEdit(): void {
    this.edit.emit(this.trait.id);
  }

  /**
   * Émet la événement de suppression avec la ID de la trait
   * Demande confirmation avant de supprimer
   */
  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.trait.name}" ?`);
    if (confirmed) {
      this.delete.emit(this.trait.id);
    }
  }
}
