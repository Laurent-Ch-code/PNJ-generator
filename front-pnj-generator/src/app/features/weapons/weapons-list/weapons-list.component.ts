/**
 * COMPOSANT LISTE DES ARMES
 * Affiche toutes les armes d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { WeaponsCardComponent } from '../weapons-card/weapons-card.component';
import { WeaponService } from '../../../services/weapon.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Weapon } from '../../../models/weapon.models';

@Component({
  selector: 'app-weapons-list',
  standalone: true,
  imports: [CommonModule, WeaponsCardComponent],
  templateUrl: './weapons-list.component.html',
  styleUrl: './weapons-list.component.scss'
})
export class WeaponsListComponent implements OnInit {
  private readonly weaponService = inject(WeaponService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  weapons: Weapon[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadWeapons();
  }

  /**
   * Charge la liste des armes depuis le service
   */
  private loadWeapons(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.weaponService.getWeapons(this.universeId).subscribe({
      next: (data) => {
        this.weapons = data ?? [];
        console.log('✅ Armes chargées:', this.weapons.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des armes:', err);
        this.errorMessage = 'Impossible de charger les armes';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle arme
   */
  addWeapon(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers la page de détail d'une arme
   * @param id ID de l'arme à afficher
   */
  goToDetail(id: string): void {
    console.log('Navigation vers le détail de l\'arme:', id);
    // TODO: Implémenter quand la page de détail existera
    this.router.navigate([id], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une arme
   * @param id ID de l'arme à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de l\'arme:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une arme
   * @param id ID de l'arme à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression de l\'arme:', id);

    this.weaponService.deleteWeapon(this.universeId,id).subscribe({
      next: () => {
        console.log('✅ Arme supprimée avec succès');
        // Recharger la liste après suppression
        this.loadWeapons();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.errorMessage = 'Impossible de supprimer l\'arme';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param weapon Arme
   * @returns L'ID unique de l'arme
   */
  trackByWeaponId(index: number, weapon: Weapon): string {
    return weapon.id;
  }
}
