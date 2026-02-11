/**
 * COMPOSANT LISTE DES IDENTITÉS
 * Affiche toutes les identités d'un univers
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentitiesCardComponent } from '../identities-card/identities-card.component';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Identity } from '../../../models/features/identity/identity.models';
  import { IdentityService } from '../../../services/features/identity/identity.service';

// TODO: Importer le service quand il sera créé
// import { IdentityService } from '../../../services/identity.service';

@Component({
  selector: 'app-identities-list',
  standalone: true,
  imports: [CommonModule, IdentitiesCardComponent],
  templateUrl: './identities-list.component.html',
  styleUrl: './identities-list.component.scss'
})
export class IdentitiesListComponent implements OnInit {
  private readonly universeContextService = inject(UniverseContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly identityService = inject(IdentityService);

  // TODO: Injecter le service quand il sera créé
  // private readonly identityService = inject(IdentityService);

  identities: Identity[] = [];
  errorMessage: string | null = null;
  universeId: string = '';

  ngOnInit(): void {
    this.loadIdentities();
  }

  /**
   * Charge la liste des identités depuis le service
   */
  private loadIdentities(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // TODO: Implémenter quand le service sera prêt
     this.identityService.getIdentities(this.universeId).subscribe({
       next: (data) => {
         this.identities = data ?? [];
         console.log('✅ Identités chargées:', this.identities.length, this.identities);
       },
      error: (err) => {
         console.error('❌ Erreur chargement identités:', err);
         this.errorMessage = 'Impossible de charger les identités';
       }
     });

    // Mock temporaire pour tester l'UI
    console.log('⚠️ Chargement identités désactivé (service pas encore créé)');
    this.identities = []; // Affichera l'état vide
  }

  /**
   * Navigation vers le formulaire de création d'une nouvelle identité
   */
  addIdentity(): void {
    console.log('Navigation vers création identité');
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'une identité
   * @param id ID de l'identité à éditer
   */
  goToEdit(id: string): void {
    console.log('Navigation vers édition identité:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Suppression d'une identité
   * @param id ID de l'identité à supprimer
   */
  goToDelete(id: string): void {
    console.log('Suppression identité:', id);

    // TODO: Implémenter quand le service sera prêt
     this.identityService.delete(this.universeId, id).subscribe({
       next: () => {
         console.log('✅ Identité supprimée avec succès');
         this.loadIdentities(); // Recharger la liste
       },
       error: (err) => {
         console.error('❌ Erreur suppression:', err);
         this.errorMessage = 'Impossible de supprimer l\'identité';
       }
     });

    console.log('⚠️ Suppression désactivée (service pas encore créé)');
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param identity Identité
   * @returns L'ID unique de l'identité
   */
  trackByIdentityId(index: number, identity: Identity): string {
    return identity.id;
  }
}
