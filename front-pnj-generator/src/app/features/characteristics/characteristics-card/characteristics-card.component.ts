/**
 * COMPOSANT CARTE DE CARACTERISTIQUE
 * Affiche une characteristic sous forme de carte avec ses stats et actions
 */

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Characteristic } from '../../../models/characteristic.models';
import { CharacteristicService } from '../../../services/characteristic.service';
import { UniverseContextService } from '../../../services/universe-context.service';

@Component({
  selector: 'app-characteristics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './characteristics-card.component.html' ,
  styleUrl: './characteristics-card.component.scss'
})
export class CharacteristicsCardComponent implements OnInit {
  /**
   * characteristic à afficher dans la carte
   */
  @Input({ required: true }) characteristic!: Characteristic;

  /**
   * Événement émis quand la utilisateur veut voir les détails
   * Émet la ID de la characteristic (string)
   */
  @Output() view = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut éditer la characteristic
   * Émet la ID de la characteristic (string)
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut supprimer la characteristic
   * Émet la ID de la characteristic (string)
   */
  @Output() delete = new EventEmitter<string>();


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characteristicService = inject(CharacteristicService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {

    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.characteristic == null) {
      var characteristicId: string | null = this.route.snapshot.paramMap.get('characteristicId');
      this.characteristicService.getCharacteristicById(this.universeId,characteristicId!).subscribe({
        next: (characteristic) => {
          this.characteristic = characteristic;
        },
        error: (error) => { }
      });
    }

  }

  /**
   * Émet la événement de vue avec la ID de la characteristic
   */
  onView(): void {
    this.view.emit(this.characteristic.id);
  }

  /**
   * Émet la événement d'édition avec la ID de la characteristic
   */
  onEdit(): void {
    this.edit.emit(this.characteristic.id);
  }

  /**
   * Émet la événement de suppression avec la ID de la characteristic
   * Demande confirmation avant de supprimer
   */
  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.characteristic.name}" ?`);
    if (confirmed) {
      this.delete.emit(this.characteristic.id);
    }
  }
}
