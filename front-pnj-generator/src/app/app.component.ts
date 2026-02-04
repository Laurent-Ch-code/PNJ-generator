import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UNIVERSES_FEATURE } from './features/features.config';
import { FeatureModels } from './models/feature.models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private readonly router = inject(Router);

  // Features disponibles (depuis la config)
  features: FeatureModels[] = UNIVERSES_FEATURE;

  // État de navigation
  currentUniverseId: string | null = null;
  isOnUniversesPage = false;
  showBackButton = false;

  // État du dropdown
  isFeaturesDropdownOpen = false;

  ngOnInit() {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateNavigationState();
      });

    // Init au chargement
    this.updateNavigationState();
  }

  /**
   * Met à jour l'état de la navigation selon l'URL courante
   */
  private updateNavigationState() {
    const url = this.router.url;
    console.log('📍 URL actuelle :', url);

    // On est sur la page liste des univers ?
    this.isOnUniversesPage = url === '/universes' || url.startsWith('/universes?');

    // Extraire l'universeId de l'URL si présent
    // Pattern : /universes/:universeId ou /universes/:universeId/quelquechose
    const universeMatch = url.match(/\/universes\/([a-f0-9-]+)/);

    if (universeMatch) {
      this.currentUniverseId = universeMatch[1];
      console.log('🌍 Univers actuel :', this.currentUniverseId);

      // Déterminer si on affiche le bouton retour
      this.updateBackButton(url);
    } else {
      this.currentUniverseId = null;
      this.showBackButton = false;
    }

    // Fermer le dropdown si changement de page
    this.isFeaturesDropdownOpen = false;
  }

  /**
   * Détermine si on doit afficher le bouton retour
   */
  private updateBackButton(url: string) {
    // On est dans une feature spécifique ?
    // Pattern : /universes/:id/weapons, /universes/:id/npcs, etc.
    const featureMatch = url.match(/\/universes\/[a-f0-9-]+\/(\w+)/);

    if (featureMatch) {
      // On est dans une feature → bouton retour visible
      this.showBackButton = true;
      console.log('⬅️ Bouton retour activé');
    } else if (url.includes('/universes/') && this.currentUniverseId) {
      // On est sur la page de détail de l'univers → pas de bouton retour
      this.showBackButton = false;
    } else {
      this.showBackButton = false;
    }
  }

  /**
   * Navigation vers l'accueil
   */
  navigateHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigation vers la liste des univers
   */
  navigateUniverses(): void {
    this.router.navigate(['/universes']);
  }

  /**
   * Navigation retour (vers l'univers)
   */
  navigateBack(): void {
    if (this.currentUniverseId) {
      this.router.navigate(['/universes', this.currentUniverseId]);
    }
  }

  /**
   * Toggle du dropdown features
   */
  toggleFeaturesDropdown(): void {
    this.isFeaturesDropdownOpen = !this.isFeaturesDropdownOpen;
    console.log('🔄 Dropdown toggled:', this.isFeaturesDropdownOpen); // ← Ajoute ce log
  }

  /**
   * Fermer le dropdown
   */
  closeFeaturesDropdown(): void {
    this.isFeaturesDropdownOpen = false;
  }
}
