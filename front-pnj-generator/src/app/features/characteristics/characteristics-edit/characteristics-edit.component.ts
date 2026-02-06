/**
 * COMPOSANT D'ÉDITION DES CARACTERISTIQUES
 * 
 * Ce composant gère à la fois la création et la édition d'une characteristic.
 * Il est utilisé sur deux routes différentes :
 * - /universes/:universeId/characteristics/new          <- Création
 * - /universes/:universeId/characteristics/:characteristicId/edit   <- Édition
 * 
 * Le mode est déterminé par la présence ou non du paramètre characteristicId dans la URL.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Characteristic } from '../../../models/features/characteristic.models';
import { UniverseService } from '../../../services/universe.service';
import { CharacteristicService } from '../../../services/features/characteristic.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-characteristics-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './characteristics-edit.component.html',
  styleUrl: './characteristics-edit.component.scss'
})
export class CharacteristicsEditComponent implements OnInit {

  // ID de la characteristic (null si création, string si édition)
  characteristicId: string | null = null;

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
  characteristicForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    value: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    modifier: new FormControl('', { nonNullable: true }),
  });

  // Injection des dépendances (style moderne Angular)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characteristicService = inject(CharacteristicService);
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
     *   └─ /characteristics                             <- (loadChildren charge WEAPONS_ROUTES)
     *       └─ ''                               <- CharacteristicsShellComponent
     *           └─ /new                         <- CharacteristicsEditComponent (ON EST ICI)
     *           └─ /:characteristicId/edit              <- CharacteristicsEditComponent (OU ICI)
     * 
     * Pour récupérer :universeId, il faut remonter dans la hiérarchie des routes.
     * L'universeId est défini 2 niveaux au-dessus (dans UniverseDetailComponent).
     */

    // On récupère characteristicId de la route actuelle (sera null si on est sur /new)
    this.characteristicId = this.route.snapshot.paramMap.get('characteristicId');
    this.isEditMode = !!this.characteristicId;

    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Chargement de la univers parent
    this.loadUniverse();

    // Si on est en mode édition, on charge la characteristic à éditer
    if (this.isEditMode && this.characteristicId) {
      this.loadCharacteristic();
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
   * Charge la characteristic à éditer depuis le service (mode édition uniquement)
   */
  private loadCharacteristic(): void {
    if (!this.characteristicId) return;

    this.characteristicService.getCharacteristicById(this.universeId, this.characteristicId).subscribe({
      next: (characteristic) => {
        console.log('✅ Arme chargée :', characteristic);
        // On remplit le formulaire avec les données de la characteristic
        this.characteristicForm.patchValue({
          name: characteristic.name,
          value: characteristic.value,
          description: characteristic.description ?? '',
          modifier: characteristic.modifier,
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la characteristic :', err);
        // Si la characteristic n'existe pas, on retourne à la liste des characteristics
        this.router.navigate(['../..'], { relativeTo: this.route });
      }
    });
  }

  /**
   * SAUVEGARDE DE L'PROTECTION
   * 
   * Gère à la fois la création et la mise à jour.
   * Le mode est déterminé par isEditMode (basé sur la présence de characteristicId).
   */
  save(): void {
    // Validation du formulaire
    if (this.characteristicForm.invalid) {
      // On marque tous les champs comme "touched" pour afficher les erreurs
      this.characteristicForm.markAllAsTouched();
      console.warn('⚠️ Formulaire invalide !');
      return;
    }

    // Récupération des valeurs du formulaire
    const formValues = this.characteristicForm.getRawValue();

    /**
     * Construction de la objet Characteristic
     * 
     * Notes importantes :
     * - On ajoute manuellement universeId (récupéré de la URL, pas du form)
     * - En mode création, id sera vide (le backend générera un UUID)
     * - En mode édition, on garde la id existant
     * - Les valeurs null deviennent undefined (convention du modèle)
     */
    const characteristicData: Characteristic = {
      id: this.isEditMode ? this.characteristicId! : '',
      name: formValues.name,
      value: formValues.value,
      description: formValues.description,
      modifier: formValues.modifier,
      universeId: this.universeId // ⚠️ Crucial : on lie la characteristic à son univers
    };

    console.log('💾 Sauvegarde de l\'characteristic :', characteristicData);

    // Appel du service approprié selon le mode
    if (this.isEditMode && this.characteristicId) {
      // Mode édition : mise à jour
      this.characteristicService.updateCharacteristic(this.universeId, characteristicData).subscribe({
        next: (updated) => {
          console.log('✅ Arme mise à jour avec succès :', updated, "this.router", this.router);
          // Retour à la liste des characteristics
          this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      // Mode création : création d'une nouvelle characteristic
      this.characteristicService.createCharacteristic(this.universeId, characteristicData).subscribe({
        next: (created) => {
          console.log('✅ Caract créée avec succès :', created);
          // Retour à la liste des characteristics
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
   * Retourne à la liste des characteristics sans sauvegarder.
   * Navigation relative : ['..'] remonte d'un niveau dans la hiérarchie des routes.
   */
  cancel(): void {
    console.log('❌ Annulation de l\'édition');
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
