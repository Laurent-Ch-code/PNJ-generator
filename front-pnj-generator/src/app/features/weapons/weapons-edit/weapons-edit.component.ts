/**
 * COMPOSANT D'ÉDITION DES ARMES
 * 
 * Ce composant gère à la fois la création et l'édition d'une arme.
 * Il est utilisé sur deux routes différentes :
 * - /universes/:universeId/weapons/new          <- Création
 * - /universes/:universeId/weapons/:weaponId/edit   <- Édition
 * 
 * Le mode est déterminé par la présence ou non du paramètre weaponId dans l'URL.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Weapon } from '../../../models/weapon.models';
import { WeaponFireMode } from '../../../models/weapon-fire-mode.enum';
import { UniverseService } from '../../../services/universe.service';
import { WeaponService } from '../../../services/weapon.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-weapons-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weapons-edit.component.html',
  styleUrl: './weapons-edit.component.scss'
})
export class WeaponsEditComponent implements OnInit {

  // ID de l'arme (null si création, string si édition)
  weaponId: string | null = null;

  // ID de l'univers parent (toujours requis)
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
   * - Il n'est pas éditable par l'utilisateur
   * - On le récupère depuis l'URL
   * - On l'ajoute manuellement lors de la sauvegarde
   */
  weaponForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    damage: new FormControl('', { nonNullable: true }),
    range: new FormControl('', { nonNullable: true }),
    capacity: new FormControl<number | null>(null),
    radius: new FormControl<number | null>(null),
    fireMode: new FormControl<WeaponFireMode | null>(null),
  });

  // Options du select pour le mode de tir
  fireModes = [
    { value: WeaponFireMode.Single, label: 'Coup par coup' },
    { value: WeaponFireMode.Burst, label: 'Rafale' },
    { value: WeaponFireMode.Automatic, label: 'Automatique' }
  ];

  // Injection des dépendances (style moderne Angular)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weaponService = inject(WeaponService);
  private readonly universeService = inject(UniverseService);

  // Univers parent chargé depuis le service
  universe!: Universe;

  ngOnInit(): void {
    /**
     * RÉCUPÉRATION DES PARAMÈTRES DE ROUTE
     * 
     * Structure de nos routes imbriquées :
     * /universes/:universeId                    <- UniverseDetailComponent
     *   └─ /weapons                             <- (loadChildren charge WEAPONS_ROUTES)
     *       └─ ''                               <- WeaponsShellComponent
     *           └─ /new                         <- WeaponsEditComponent (ON EST ICI)
     *           └─ /:weaponId/edit              <- WeaponsEditComponent (OU ICI)
     * 
     * Pour récupérer :universeId, il faut remonter dans la hiérarchie des routes.
     * L'universeId est défini 2 niveaux au-dessus (dans UniverseDetailComponent).
     */

    // On récupère weaponId de la route actuelle (sera null si on est sur /new)
    this.weaponId = this.route.snapshot.paramMap.get('weaponId');
    this.isEditMode = !!this.weaponId;

    // On remonte la hiérarchie pour trouver universeId
    let currentRoute: ActivatedRoute | null = this.route;
    let universeId: string | null = null;

    // On parcourt tous les parents jusqu'à trouver universeId
    while (currentRoute && !universeId) {
      universeId = currentRoute.snapshot.paramMap.get('universeId');
      currentRoute = currentRoute.parent;
    }

    this.universeId = universeId || '';

    // Si on n'a pas trouvé d'universeId, il y a un problème de routing
    if (!this.universeId) {
      console.error('❌ Aucun universeId trouvé dans les routes !');
      console.error('Vérifiez que la route est bien configurée avec :universeId');
      this.router.navigate(['/universes']);
      return;
    }

    // Chargement de l'univers parent
    this.loadUniverse();

    // Si on est en mode édition, on charge l'arme à éditer
    if (this.isEditMode && this.weaponId) {
      this.loadWeapon();
    }
  }

  /**
   * Charge l'univers parent depuis le service
   */
  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.universe = universe;
        console.log('✅ Univers chargé :', universe.name);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'univers :', err);
        // Si l'univers n'existe pas, on retourne à la liste des univers
        this.router.navigate(['/universes']);
      }
    });
  }

  /**
   * Charge l'arme à éditer depuis le service (mode édition uniquement)
   */
  private loadWeapon(): void {
    if (!this.weaponId) return;

    this.weaponService.getWeaponById(this.weaponId).subscribe({
      next: (weapon) => {
        console.log('✅ Arme chargée :', weapon);
        // On remplit le formulaire avec les données de l'arme
        this.weaponForm.patchValue({
          name: weapon.name,
          type: weapon.type,
          description: weapon.description ?? '',
          damage: weapon.damage,
          range: weapon.range ?? '',
          capacity: weapon.capacity ?? null,
          radius: weapon.radius ?? null,
          fireMode: weapon.weaponFireMode ?? null
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'arme :', err);
        // Si l'arme n'existe pas, on retourne à la liste des armes
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  /**
   * SAUVEGARDE DE L'ARME
   * 
   * Gère à la fois la création et la mise à jour.
   * Le mode est déterminé par isEditMode (basé sur la présence de weaponId).
   */
  save(): void {
    // Validation du formulaire
    if (this.weaponForm.invalid) {
      // On marque tous les champs comme "touched" pour afficher les erreurs
      this.weaponForm.markAllAsTouched();
      console.warn('⚠️ Formulaire invalide !');
      return;
    }

    // Récupération des valeurs du formulaire
    const formValues = this.weaponForm.getRawValue();

    /**
     * Construction de l'objet Weapon
     * 
     * Notes importantes :
     * - On ajoute manuellement universeId (récupéré de l'URL, pas du form)
     * - En mode création, id sera vide (le backend générera un UUID)
     * - En mode édition, on garde l'id existant
     * - Les valeurs null deviennent undefined (convention du modèle)
     */
    const weaponData: Weapon = {
      id: this.isEditMode ? this.weaponId! : '',
      name: formValues.name,
      type: formValues.type,
      description: formValues.description,
      damage: formValues.damage,
      range: formValues.range,
      capacity: formValues.capacity ?? undefined,
      radius: formValues.radius ?? undefined,
      weaponFireMode: formValues.fireMode ?? undefined,
      universeId: this.universeId // ⚠️ Crucial : on lie l'arme à son univers
    };

    console.log('💾 Sauvegarde de l\'arme :', weaponData);

    // Appel du service approprié selon le mode
    if (this.isEditMode && this.weaponId) {
      // Mode édition : mise à jour
      this.weaponService.updateWeapon(weaponData).subscribe({
        next: (updated) => {
          console.log('✅ Arme mise à jour avec succès :', updated, "this.router", this.router);
          // Retour à la liste des armes
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      // Mode création : création d'une nouvelle arme
      this.weaponService.createWeapon(weaponData).subscribe({
        next: (created) => {
          console.log('✅ Arme créée avec succès :', created);
          // Retour à la liste des armes
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
   * Retourne à la liste des armes sans sauvegarder.
   * Navigation relative : ['..'] remonte d'un niveau dans la hiérarchie des routes.
   */
  cancel(): void {
    console.log('❌ Annulation de l\'édition');
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
