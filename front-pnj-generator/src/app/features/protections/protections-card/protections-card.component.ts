/**
 * COMPOSANT CARTE D'ARME
 * Affiche une protection sous forme de carte avec ses stats et actions
 */

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Protection } from '../../../models/protection.models';
import { ProtectionService } from '../../../services/protection.service';
import { UniverseContextService } from '../../../services/universe-context.service';

@Component({
  selector: 'app-protections-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protections-card.component.html' ,
  styleUrl: './protections-card.component.scss'
})
export class ProtectionsCardComponent implements OnInit {
  /**
   * protection à afficher dans la carte
   */
  @Input({ required: true }) protection!: Protection;

  /**
   * Événement émis quand la utilisateur veut éditer la protection
   * Émet la ID de la protection (string)
   */
  @Output() edit = new EventEmitter<string>();

  /**
   * Événement émis quand la utilisateur veut supprimer la protection
   * Émet la ID de la protection (string)
   */
  @Output() delete = new EventEmitter<string>();


  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly protectionService = inject(ProtectionService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {

    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.protection == null) {
      var protectionId: string | null = this.route.snapshot.paramMap.get('protectionId');
      this.protectionService.getProtectionById(this.universeId, protectionId!).subscribe({
        next: (protection) => {
          this.protection = protection;
        },
        error: (error) => { }
      });
    }

  }

  /**
   * Émet la événement d'édition avec la ID de la protection
   */
  onEdit(): void {
    this.edit.emit(this.protection.id);
  }

  /**
   * Émet la événement de suppression avec la ID de la protection
   * Demande confirmation avant de supprimer
   */
  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.protection.name}" ?`);
    if (confirmed) {
      this.delete.emit(this.protection.id);
    }
  }
}
