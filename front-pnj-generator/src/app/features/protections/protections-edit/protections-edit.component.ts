/**
 * COMPOSANT D'ÉDITION DES PROTECTIONS
 * 
 * Ce composant gère à la fois la création et la édition d'une protection.
 * Il est utilisé sur deux routes différentes :
 * - /universes/:universeId/protections/new          <- Création
 * - /universes/:universeId/protections/:protectionId/edit   <- Édition
 * 
 * Le mode est déterminé par la présence ou non du paramètre protectionId dans la URL.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Protection } from '../../../models/protection.models';
import { UniverseService } from '../../../services/universe.service';
import { ProtectionService } from '../../../services/protection.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-protections-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './protections-edit.component.html',
  styleUrl: './protections-edit.component.scss'
})
export class ProtectionsEditComponent implements OnInit {

  // ID de la protection (null si création, string si édition)
  protectionId: string | null = null;

  // ID de la univers parent (toujours requis)
  universeId: string = '';

  // Détermine si on est en mode création ou édition
  isEditMode = false;

  // Indicateur de sauvegarde en cours
  isSaving = false;

  /**
   * FORMULAIRE RÉACTIF
   * 
   * Seul le champ 'name' est requis pour la V1.
   * Les autres champs sont optionnels.
   * 
   * Note : On ne met PAS universeId dans le formulaire car :
   * - Il n'est pas éditable par la utilisateur
   * - On le récupère depuis la URL
   * - On la ajoute manuellement lors de la sauvegarde
   */
  protectionForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    armorRating: new FormControl('', { nonNullable: true }),
    material: new FormControl('', { nonNullable: true }),
    weight: new FormControl('', { nonNullable: true }),
  });

  // Injection des dépendances (style moderne Angular)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly protectionService = inject(ProtectionService);
  private readonly universeService = inject(UniverseService);
  private readonly universeContextService = inject(UniverseContextService);

  // Univers parent chargé depuis le service
  universe!: Universe;

  ngOnInit(): void {
    /**
     * RÉCUPÉRATION DES PARAMÈTRES DE ROUTE
     * 
     * Structure de nos routes imbriquées :
     * /universes/:universeId                    <- UniverseDetailComponent
     *   └─ /protections                             <- (loadChildren charge WEAPONS_ROUTES)
     *       └─ ''                               <- ProtectionsShellComponent
     *           └─ /new                         <- ProtectionsEditComponent (ON EST ICI)
     *           └─ /:protectionId/edit              <- ProtectionsEditComponent (OU ICI)
     * 
     * Pour récupérer :universeId, il faut remonter dans la hiérarchie des routes.
     * L'universeId est défini 2 niveaux au-dessus (dans UniverseDetailComponent).
     */

    // On récupère protectionId de la route actuelle (sera null si on est sur /new)
    this.protectionId = this.route.snapshot.paramMap.get('protectionId');
    this.isEditMode = !!this.protectionId;

    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Chargement de la univers parent
    this.loadUniverse();

    // Si on est en mode édition, on charge la protection à éditer
    if (this.isEditMode && this.protectionId) {
      this.loadProtection();
    }
  }

  /**
   * Charge la univers parent depuis le service
   */
  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.universe = universe;
        console.log('✅ Univers chargé :', universe.name);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'univers :', err);
        // Si la univers n'existe pas, on retourne à la liste des univers
        this.router.navigate(['/universes']);
      }
    });
  }

  /**
   * Charge la protection à éditer depuis le service (mode édition uniquement)
   */
  private loadProtection(): void {
    if (!this.protectionId) return;

    this.protectionService.getProtectionById(this.universeId, this.protectionId).subscribe({
      next: (protection) => {
        console.log('✅ Arme chargée :', protection);
        // On remplit le formulaire avec les données de la protection
        this.protectionForm.patchValue({
          name: protection.name,
          type: protection.type,
          description: protection.description ?? '',
          armorRating: protection.armorRating,
          material: protection.material ?? '',
          weight: protection.weight ?? null,
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la protection :', err);
        // Si la protection n'existe pas, on retourne à la liste des protections
        this.router.navigate(['../..'], { relativeTo: this.route });
      }
    });
  }

  /**
   * SAUVEGARDE DE L'PROTECTION
   * 
   * Gère à la fois la création et la mise à jour.
   * Le mode est déterminé par isEditMode (basé sur la présence de protectionId).
   */
  save(): void {
    // Validation du formulaire
    if (this.protectionForm.invalid) {
      // On marque tous les champs comme "touched" pour afficher les erreurs
      this.protectionForm.markAllAsTouched();
      console.warn('⚠️ Formulaire invalide !');
      return;
    }

    // Récupération des valeurs du formulaire
    const formValues = this.protectionForm.getRawValue();

    /**
     * Construction de la objet Protection
     * 
     * Notes importantes :
     * - On ajoute manuellement universeId (récupéré de la URL, pas du form)
     * - En mode création, id sera vide (le backend générera un UUID)
     * - En mode édition, on garde la id existant
     * - Les valeurs null deviennent undefined (convention du modèle)
     */
    const protectionData: Protection = {
      id: this.isEditMode ? this.protectionId! : '',
      name: formValues.name,
      type: formValues.type,
      description: formValues.description,
      armorRating: formValues.armorRating,
      material: formValues.material,
      weight: formValues.weight ?? undefined,
      universeId: this.universeId // ⚠️ Crucial : on lie la protection à son univers
    };

    console.log('💾 Sauvegarde de l\'protection :', protectionData);

    // Appel du service approprié selon le mode
    if (this.isEditMode && this.protectionId) {
      // Mode édition : mise à jour
      this.protectionService.updateProtection(this.universeId, protectionData).subscribe({
        next: (updated) => {
          console.log('✅ Arme mise à jour avec succès :', updated, "this.router", this.router);
          // Retour à la liste des protections
          this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      // Mode création : création d'une nouvelle protection
      this.protectionService.createProtection(this.universeId, protectionData).subscribe({
        next: (created) => {
          console.log('✅ Arme créée avec succès :', created);
          // Retour à la liste des protections
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création :', err);
        }
      });
    }
  }

  /**
   * ANNULATION
   * 
   * Retourne à la liste des protections sans sauvegarder.
   * Navigation relative : ['..'] remonte d'un niveau dans la hiérarchie des routes.
   */
  cancel(): void {
    console.log('❌ Annulation de l\'édition');
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
