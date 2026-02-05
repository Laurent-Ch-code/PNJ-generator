/**
 * COMPOSANT CARTE DE TRAIT
 * Affiche un trait sous forme de carte avec ses stats et actions
 * 
 * Ce composant peut être utilisé de 2 façons :
 * 1. En mode "card" dans une liste (avec @Input trait)
 * 2. En mode "page détail" avec route (charge le trait depuis l'API)
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
  templateUrl: './traits-card.component.html',
  styleUrl: './traits-card.component.scss'
})
export class TraitsCardComponent implements OnInit {
  /**
   * Trait à afficher dans la carte
   * Si fourni en @Input, on est en mode "card dans une liste"
   * Si null, on charge depuis la route (mode "page détail")
   */
  @Input() trait: Trait | null = null;

  /**
   * Événement émis quand l'utilisateur veut voir les détails
   * Utilisé uniquement en mode "card dans une liste"
   */
  @Output() view = new EventEmitter<string>();

  /**
   * Événement émis quand l'utilisateur veut éditer le trait
   * Utilisé uniquement en mode "card dans une liste"
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand l'utilisateur veut supprimer le trait
   * Utilisé uniquement en mode "card dans une liste"
   */
  @Output() delete = new EventEmitter<string>();

  // Services injectés
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly traitService = inject(TraitService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  // Détermine si on est en mode "page détail" ou "card dans liste"
  isDetailMode = false;

  // État de chargement et erreurs
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Si pas de trait fourni en @Input, on est en mode "page détail"
    if (!this.trait) {
      this.isDetailMode = true;
      this.loadTraitFromRoute();
    }
  }

  /**
   * Charge le trait depuis la route (mode "page détail")
   */
  private loadTraitFromRoute(): void {
    const traitId = this.route.snapshot.paramMap.get('traitId');

    if (!traitId) {
      this.errorMessage = 'ID du trait manquant';
      return;
    }

    this.isLoading = true;
    this.traitService.getTraitById(this.universeId, traitId).subscribe({
      next: (trait) => {
        this.trait = trait;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du trait :', error);
        this.errorMessage = 'Impossible de charger le trait';
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigation vers la page de détail
   * Utilisé en mode "card dans liste"
   */
  onView(): void {
    if (this.isDetailMode) {
      // Déjà en mode détail, ne rien faire
      return;
    }

    // Émettre l'événement pour le parent OU naviguer directement
    if (this.view.observed) {
      this.view.emit(this.trait!.id);
    } else {
      // Navigation par défaut si pas d'écouteur
      this.router.navigate([this.trait!.id], { relativeTo: this.route.parent });
    }
  }

  /**
   * Navigation vers la page d'édition
   */
  onEdit(): void {
    if (this.isDetailMode) {
      // En mode détail, naviguer vers la route d'édition
      this.router.navigate(['edit'], { relativeTo: this.route });
    } else {
      // En mode card, émettre l'événement OU naviguer
      if (this.edit.observed) {
        this.edit.emit(this.trait!.id);
      } else {
        this.router.navigate([this.trait!.id, 'edit'], { relativeTo: this.route.parent });
      }
    }
  }

  /**
   * Suppression du trait
   */
  onDelete(): void {
    if (!this.trait) return;

    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.trait.name}" ?`);
    if (!confirmed) return;

    if (this.isDetailMode) {
      // En mode détail, supprimer et retourner à la liste
      this.traitService.deleteTrait(this.universeId, this.trait.id).subscribe({
        next: () => {
          console.log('✅ Trait supprimé avec succès');
          // Retour à la liste via navigation relative
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression :', error);
          alert('Erreur lors de la suppression du trait');
        }
      });
    } else {
      // En mode card, émettre l'événement
      this.delete.emit(this.trait.id);
    }
  }
}
