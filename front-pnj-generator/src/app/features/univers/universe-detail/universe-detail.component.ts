/**
 * COMPOSANT DÉTAIL D'UNIVERS
 * Affiche les informations d'un univers et ses features disponibles
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CardComponent } from '../../card/card.component';
import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';
import { UNIVERSES_FEATURE } from '../../features.config';
import { FeatureModels } from '../../../models/feature.models';

@Component({
  selector: 'app-universe-detail',
  imports: [CardComponent, CommonModule, RouterOutlet],
  templateUrl: './universe-detail.component.html',
  styleUrl: './universe-detail.component.scss'
})
export class UniverseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);

  universeId!: string | null;
  universe!: Universe;
  errorMessage: string | null = null;
  features = UNIVERSES_FEATURE;

  ngOnInit(): void {
    this.universeId = this.route.snapshot.paramMap.get('universeId'); // Utiliser 'universeId' pas 'id'

    if (!this.universeId) {
      console.error('Pas d\'universeId dans la route');
      this.router.navigate(['/universes']);
      return;
    }

    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (data) => {
        this.universe = data;
        console.log('Univers chargé:', this.universe);
        console.log('Features disponibles:', this.features);
      },
      error: (err) => {
        console.error('Erreur chargement univers:', err);
        this.errorMessage = 'Impossible de charger l\'univers demandé.';
      }
    });
  }

  /**
   * Navigation vers une feature
   * @param feature La feature sélectionnée
   */
  goToFeature(feature: FeatureModels): void {
    console.log('Navigation vers feature:', feature);
    this.router.navigate([feature.route], { relativeTo: this.route });
  }

  /**
   * Retour à la liste des univers
   */
  goBackToList(): void {
    this.router.navigate(['/universes']);
  }

  /**
   * Navigation vers l'édition de l'univers
   */
  editUniverse(): void {
    if (this.universeId) {
      this.router.navigate(['/universes', this.universeId, 'edit']);
    }
  }
}
