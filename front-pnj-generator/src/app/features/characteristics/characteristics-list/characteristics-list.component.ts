/**
 * COMPOSANT LISTE DES CARACTERISTIQUES
 * Affiche toutes les characteristics d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CharacteristicsCardComponent } from '../characteristics-card/characteristics-card.component';
import { CharacteristicService } from '../../../services/characteristic.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Characteristic } from '../../../models/characteristic.models';

@Component({
  selector: 'app-characteristics-list',
  imports: [CommonModule, CharacteristicsCardComponent],
  templateUrl: './characteristics-list.component.html',
  styleUrl: './characteristics-list.component.scss'
})
export class CharacteristicsListComponent implements OnInit {
  private readonly characteristicService = inject(CharacteristicService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  characteristics: Characteristic[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadCharacteristics();
  }

  /**
   * Charge la liste des characteristics depuis le service
   */
  private loadCharacteristics(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.characteristicService.getCharacteristics(this.universeId).subscribe({
      next: (data) => {
        this.characteristics = data ?? [];
        console.log('✅ Armes chargées:', this.characteristics.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des characteristics:', err);
        this.errorMessage = 'Impossible de charger les characteristics';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle characteristic
   */
  addCharacteristic(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers la page de détail d'une characteristic
   * @param id ID de l'characteristic à afficher
   */
  goToDetail(id: string): void {
    console.log('Navigation vers le détail de la characteristic:', id);
    // TODO: Implémenter quand la page de détail existera
    this.router.navigate([id], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une characteristic
   * @param id ID de l'characteristic à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de la characteristic:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une characteristic
   * @param id ID de l'characteristic à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression de la characteristic:', id);

    this.characteristicService.deleteCharacteristic(id, this.universeId).subscribe({
      next: () => {
        console.log('✅ Characteristic supprimée avec succès');
        // Recharger la liste après suppression
        this.loadCharacteristics();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.errorMessage = 'Impossible de supprimer la characteristic';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param characteristic Arme
   * @returns L'ID unique de l'characteristic
   */
  trackByCharacteristicId(index: number, characteristic: Characteristic): string {
    return characteristic.id;
  }
}
