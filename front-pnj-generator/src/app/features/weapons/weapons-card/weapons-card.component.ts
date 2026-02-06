/**
 * COMPOSANT CARTE D'ARME
 * Affiche une arme sous forme de carte avec ses stats et actions
 */

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Weapon } from '../../../models/features/weapon.models';
import { WeaponService } from '../../../services/features/weapon.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { WeaponFireMode } from '../../../models/features/weapon-fire-mode.enum';

@Component({
  selector: 'app-weapons-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons-card.component.html',
  styleUrl: './weapons-card.component.scss'
})
export class WeaponsCardComponent implements OnInit {
  /**
   * L'arme à afficher dans la carte
   */
  @Input({ required: true }) weapon!: Weapon;

  /**
   * Événement émis quand l'utilisateur veut éditer l'arme
   * Émet l'ID de l'arme (string)
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand l'utilisateur veut supprimer l'arme
   * Émet l'ID de l'arme (string)
   */
  @Output() delete = new EventEmitter<string>();


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weaponService = inject(WeaponService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {

    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.weapon == null) {
      var weaponId: string | null = this.route.snapshot.paramMap.get('weaponId');
      this.weaponService.getWeaponById(weaponId!, this.universeId).subscribe({
        next: (weapon) => {
          this.weapon = weapon;
        },
        error: (error) => { }
      });
    }

  }

  /**
   * Émet l'événement d'édition avec l'ID de l'arme
   */
  onEdit(): void {
    this.edit.emit(this.weapon.id);
  }

  /**
   * Émet l'événement de suppression avec l'ID de l'arme
   * Demande confirmation avant de supprimer
   */
  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.weapon.name}" ?`);
    if (confirmed) {
      this.delete.emit(this.weapon.id);
    }
  }

  /**
   * Convertit l'enum du mode de tir en label lisible
   * @param mode Le mode de tir (enum)
   * @returns Le label en français
   */
  getFireModeLabel(mode: WeaponFireMode): string {
    switch (mode) {
      case WeaponFireMode.Single:
        return 'Coup par coup';
      case WeaponFireMode.Burst:
        return 'Rafale';
      case WeaponFireMode.Automatic:
        return 'Automatique';
      default:
        return 'Inconnu';
    }
  }
}
