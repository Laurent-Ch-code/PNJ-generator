/**
 * COMPOSANT D'ÉDITION DES COMPETENCES
 * 
 * Ce composant gère à la fois la création et la édition d'une trait.
 * Il est utilisé sur deux routes différentes :
 * - /universes/:universeId/traits/new          <- Création
 * - /universes/:universeId/traits/:traitId/edit   <- Édition
 * 
 * Le mode est déterminé par la présence ou non du paramètre traitId dans la URL.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Trait } from '../../../models/trait.models';
import { UniverseService } from '../../../services/universe.service';
import { TraitService } from '../../../services/trait.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-traits-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './traits-edit.component.html',
  styleUrl: './traits-edit.component.scss'
})
export class TraitsEditComponent implements OnInit {

  // ID de la trait (null si création, string si édition)
  traitId: string | null = null;

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
  traitForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    effect: new FormControl('', { nonNullable: true }),
    malus: new FormControl('', { nonNullable: true }),
    prerequisites: new FormControl('', { nonNullable: true }),
  });

  // Injection des dépendances (style moderne Angular)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly traitService = inject(TraitService);
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
     *   └─ /traits                             <- (loadChildren charge WEAPONS_ROUTES)
     *       └─ ''                               <- TraitsShellComponent
     *           └─ /new                         <- TraitsEditComponent (ON EST ICI)
     *           └─ /:traitId/edit              <- TraitsEditComponent (OU ICI)
     * 
     * Pour récupérer :universeId, il faut remonter dans la hiérarchie des routes.
     * L'universeId est défini 2 niveaux au-dessus (dans UniverseDetailComponent).
     */

    // On récupère traitId de la route actuelle (sera null si on est sur /new)
    this.traitId = this.route.snapshot.paramMap.get('traitId');
    this.isEditMode = !!this.traitId;

    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Chargement de la univers parent
    this.loadUniverse();

    // Si on est en mode édition, on charge la trait à éditer
    if (this.isEditMode && this.traitId) {
      this.loadTrait();
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
   * Charge la trait à éditer depuis le service (mode édition uniquement)
   */
  private loadTrait(): void {
    if (!this.traitId) return;

    this.traitService.getTraitById(this.traitId, this.universeId).subscribe({
      next: (trait) => {
        console.log('✅ Arme chargée :', trait);
        // On remplit le formulaire avec les données de la trait
        this.traitForm.patchValue({
          name: trait.name,
          type: trait.type,
          description: trait.description ?? '',
          effect: trait.effect,
          prerequisites: trait.prerequisites,
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la trait :', err);
        // Si la trait n'existe pas, on retourne à la liste des traits
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  /**
   * SAUVEGARDE DE L'PROTECTION
   * 
   * Gère à la fois la création et la mise à jour.
   * Le mode est déterminé par isEditMode (basé sur la présence de traitId).
   */
  save(): void {
    // Validation du formulaire
    if (this.traitForm.invalid) {
      // On marque tous les champs comme "touched" pour afficher les erreurs
      this.traitForm.markAllAsTouched();
      console.warn('⚠️ Formulaire invalide !');
      return;
    }

    // Récupération des valeurs du formulaire
    const formValues = this.traitForm.getRawValue();

    /**
     * Construction de la objet Trait
     * 
     * Notes importantes :
     * - On ajoute manuellement universeId (récupéré de la URL, pas du form)
     * - En mode création, id sera vide (le backend générera un UUID)
     * - En mode édition, on garde la id existant
     * - Les valeurs null deviennent undefined (convention du modèle)
     */
    const traitData: Trait = {
      id: this.isEditMode ? this.traitId! : '',
      name: formValues.name,
      type: formValues.type,
      description: formValues.description,
      effect: formValues.effect,
      prerequisites: formValues.prerequisites,
      universeId: this.universeId // ⚠️ Crucial : on lie la trait à son univers
    };

    console.log('💾 Sauvegarde de l\'trait :', traitData);

    // Appel du service approprié selon le mode
    if (this.isEditMode && this.traitId) {
      // Mode édition : mise à jour
      this.traitService.updateTrait(this.universeId, traitData).subscribe({
        next: (updated) => {
          console.log('✅ Arme mise à jour avec succès :', updated, "this.router", this.router);
          // Retour à la liste des traits
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      // Mode création : création d'une nouvelle trait
      this.traitService.createTrait(this.universeId, traitData).subscribe({
        next: (created) => {
          console.log('✅ Arme créée avec succès :', created);
          // Retour à la liste des traits
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
   * Retourne à la liste des traits sans sauvegarder.
   * Navigation relative : ['..'] remonte d'un niveau dans la hiérarchie des routes.
   */
  cancel(): void {
    console.log('❌ Annulation de l\'édition');
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
