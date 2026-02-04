/**
 * COMPOSANT LISTE DES ARMES
 * Affiche toutes les protections d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProtectionsCardComponent } from '../protections-card/protections-card.component';
import { ProtectionService } from '../../../services/protection.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Protection } from '../../../models/protection.models';

@Component({
  selector: 'app-protections-list',
  imports: [CommonModule, ProtectionsCardComponent],
  templateUrl: './protections-list.component.html',
  styleUrl: './protections-list.component.scss'
})
export class ProtectionsListComponent implements OnInit {
  private readonly protectionService = inject(ProtectionService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protections: Protection[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadProtections();
  }

  /**
   * Charge la liste des protections depuis le service
   */
  private loadProtections(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.protectionService.getProtections(this.universeId).subscribe({
      next: (data) => {
        this.protections = data ?? [];
        console.log('✅ Armes chargées:', this.protections.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des protections:', err);
        this.errorMessage = 'Impossible de charger les protections';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle protection
   */
  addProtection(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers la page de détail d'une protection
   * @param id ID de l'protection à afficher
   */
  goToDetail(id: string): void {
    console.log('Navigation vers le détail de la protection:', id);
    // TODO: Implémenter quand la page de détail existera
    this.router.navigate([id], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une protection
   * @param id ID de l'protection à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de la protection:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une protection
   * @param id ID de l'protection à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression de la protection:', id);

    this.protectionService.deleteProtection(id, this.universeId).subscribe({
      next: () => {
        console.log('✅ Protection supprimée avec succès');
        // Recharger la liste après suppression
        this.loadProtections();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.errorMessage = 'Impossible de supprimer la protection';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param protection Arme
   * @returns L'ID unique de l'protection
   */
  trackByProtectionId(index: number, protection: Protection): string {
    return protection.id;
  }
}
