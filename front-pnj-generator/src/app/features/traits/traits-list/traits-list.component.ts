/**
 * COMPOSANT LISTE DES COMPETENCES
 * Affiche toutes les traits d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TraitsCardComponent } from '../traits-card/traits-card.component';
import { TraitService } from '../../../services/features/trait.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Trait } from '../../../models/features/trait.models';

@Component({
  selector: 'app-traits-list',
  imports: [CommonModule, TraitsCardComponent],
  templateUrl: './traits-list.component.html',
  styleUrl: './traits-list.component.scss'
})
export class TraitsListComponent implements OnInit {
  private readonly traitService = inject(TraitService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  traits: Trait[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadTraits();
  }

  /**
   * Charge la liste des traits depuis le service
   */
  private loadTraits(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.traitService.getTraits(this.universeId).subscribe({
      next: (data) => {
        this.traits = data ?? [];
        console.log('✅ Trait chargées:', this.traits.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des traits:', err);
        this.errorMessage = 'Impossible de charger les traits';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle trait
   */
  addTrait(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une trait
   * @param id ID de l'trait à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de la trait:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une trait
   * @param id ID de l'trait à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression de la trait:', id);

    this.traitService.deleteTrait(this.universeId,id).subscribe({
      next: () => {
        console.log('✅ Trait supprimée avec succès');
        // Recharger la liste après suppression
        this.loadTraits();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.errorMessage = 'Impossible de supprimer la trait';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param trait Arme
   * @returns L'ID unique de l'trait
   */
  trackByTraitId(index: number, trait: Trait): string {
    return trait.id;
  }
}
