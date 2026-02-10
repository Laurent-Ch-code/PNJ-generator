import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender, AgeCategory } from '../../../models/features/identity/identity.enums';
import { Alignment, Culture, Identity, Species, Origin } from '../../../models/features/identity/identity.models';
import { UniverseContextService } from '../../../services/universe-context.service';
import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';


@Component({
  selector: 'app-identities-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './identities-edit.component.html',
  styleUrl: './identities-edit.component.scss'
})
export class IdentitiesEditComponent implements OnInit {

  // ID de l'identité (null si création)
  identityId: string | null = null;

  // ID de l'univers parent
  universeId: string = '';

  // Mode création ou édition
  isEditMode = false;

  // Indicateur de sauvegarde
  isSaving = false;

  /**
   * FORMULAIRE RÉACTIF
   * 
   * RÈGLES DE VALIDATION :
   * - gender : obligatoire
   * - Au moins 1 des 3 : firstName, lastName, nickname (validator custom)
   * - Tous les autres champs : optionnels
   */
  identityForm = new FormGroup({
    // Race et culture (optionnelles)
    speciesId: new FormControl<string | null>(null),
    cultureId: new FormControl<string | null>(null),

    // Genre (obligatoire)
    gender: new FormControl<Gender | null>(null, { validators: [Validators.required] }),

    // Éléments d'identité (au moins 1 obligatoire via validator custom)
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    nickname: new FormControl('', { nonNullable: true }),

    // Âge (optionnel)
    age: new FormControl<number | null>(null),

    // Alignement (optionnel)
    alignmentId: new FormControl<string | null>(null),

    originId: new FormControl<string | null>(null),

    // Description (optionnelle)
    description: new FormControl('', { nonNullable: true })
  }, {
    // Validator custom au niveau du groupe
    validators: [this.atLeastOneIdentityValidator()]
  });

  // Enum Gender exposé pour le template
  Gender = Gender;

  // Options pour le select Genre
  genderOptions = [
    { value: Gender.Male, label: 'Masculin' },
    { value: Gender.Female, label: 'Féminin' },
    { value: Gender.Neutral, label: 'Neutre' }
  ];

  // Listes pour les dropdowns (à charger via services)
  cultures: Culture[] = [];  // TODO: typer avec Culture[]
  species: Species[] = [];   // TODO: typer avec Species[]
  alignments: Alignment[] = []; // TODO: typer avec Alignment[]
  origins: Origin[] = []; // TODO: typer avec Alignment[]

  // Injection des dépendances
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);
  private readonly universeContextService = inject(UniverseContextService);


  // Univers parent
  universe!: Universe;

  ngOnInit(): void {
    // Récupération des paramètres de route
    this.identityId = this.route.snapshot.paramMap.get('identityId');
    this.isEditMode = !!this.identityId;

    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Chargements
    this.loadUniverse();
    this.loadDropdownData();

    // Si mode édition, charger l'identité
    if (this.isEditMode && this.identityId) {
      this.loadIdentity();
    }
  }

  /**
   * VALIDATOR CUSTOM : Au moins 1 champ identité requis
   * 
   * Vérifie qu'au moins UN des champs firstName, lastName ou nickname
   * contient une valeur non vide (après trim).
   */
  private atLeastOneIdentityValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const firstName = group.get('firstName')?.value?.trim();
      const lastName = group.get('lastName')?.value?.trim();
      const nickname = group.get('nickname')?.value?.trim();

      // Si au moins un des trois est rempli, validation OK
      if (firstName || lastName || nickname) {
        return null; // Pas d'erreur
      }

      // Sinon, erreur de validation
      return { atLeastOneIdentityRequired: true };
    };
  }

  /**
   * Charge l'univers parent
   */
  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.universe = universe;
        console.log('✅ Univers chargé :', universe.name);
      },
      error: (err) => {
        console.error('❌ Erreur chargement univers :', err);
        this.router.navigate(['/universes']);
      }
    });
  }

  /**
   * Charge les données pour les dropdowns (cultures, species, alignments)
   */
  private loadDropdownData(): void {
    // TODO: Implémenter quand les services seront prêts

    // this.cultureService.getAll(this.universeId).subscribe({
    //   next: (cultures) => {
    //     this.cultures = cultures;
    //     console.log('✅ Cultures chargées :', cultures.length);
    //   },
    //   error: (err) => console.error('❌ Erreur chargement cultures :', err)
    // });

    // this.speciesService.getAll(this.universeId).subscribe({
    //   next: (species) => {
    //     this.species = species;
    //     console.log('✅ Species chargées :', species.length);
    //   },
    //   error: (err) => console.error('❌ Erreur chargement species :', err)
    // });

    // this.alignmentService.getAll(this.universeId).subscribe({
    //   next: (alignments) => {
    //     this.alignments = alignments;
    //     console.log('✅ Alignements chargés :', alignments.length);
    //   },
    //   error: (err) => console.error('❌ Erreur chargement alignements :', err)
    // });

    console.log('⚠️ Chargement dropdowns désactivé (services pas encore créés)');
  }

  /**
   * Charge l'identité à éditer (mode édition uniquement)
   */
  private loadIdentity(): void {
    if (!this.identityId) return;

    // TODO: Implémenter quand le service sera prêt

    // this.identityPresetService.getById(this.identityId, this.universeId).subscribe({
    //   next: (identity) => {
    //     console.log('✅ Identité chargée :', identity);
    //     this.identityForm.patchValue({
    //       speciesId: identity.speciesId ?? null,
    //       cultureId: identity.cultureId ?? null,
    //       gender: identity.gender,
    //       firstName: identity.firstName ?? '',
    //       lastName: identity.lastName ?? '',
    //       nickname: identity.nickname ?? '',
    //       age: identity.age ?? null,
    //       alignmentId: identity.alignmentId ?? null,
    //       description: identity.description ?? ''
    //     });
    //   },
    //   error: (err) => {
    //     console.error('❌ Erreur chargement identité :', err);
    //     this.router.navigate(['..'], { relativeTo: this.route });
    //   }
    // });

    console.log('⚠️ Chargement identité désactivé (service pas encore créé)');
  }

  /**
   * SAUVEGARDE
   */
  save(): void {
    // Validation
    if (this.identityForm.invalid) {
      this.identityForm.markAllAsTouched();
      console.warn('⚠️ Formulaire invalide !');
      return;
    }

    const formValues = this.identityForm.getRawValue();

    // Construction de l'objet à envoyer au backend
    const identityData = {
      id: this.isEditMode ? this.identityId! : '',
      universeId: this.universeId,
      speciesId: formValues.speciesId ?? undefined,
      cultureId: formValues.cultureId ?? undefined,
      gender: formValues.gender!,
      firstName: formValues.firstName || undefined,
      lastName: formValues.lastName || undefined,
      nickname: formValues.nickname || undefined,
      age: formValues.age ?? undefined,
      alignmentId: formValues.alignmentId ?? undefined,
      description: formValues.description || undefined,
      origin: formValues.originId || undefined
    };

    console.log('💾 Sauvegarde identité :', identityData);

    this.isSaving = true;

    // TODO: Implémenter l'appel au service

    // if (this.isEditMode && this.identityId) {
    //   // Mode édition
    //   this.identityPresetService.update(identityData, this.universeId).subscribe({
    //     next: (updated) => {
    //       console.log('✅ Identité mise à jour :', updated);
    //       this.router.navigate(['..'], { relativeTo: this.route });
    //     },
    //     error: (err) => {
    //       console.error('❌ Erreur mise à jour :', err);
    //       this.isSaving = false;
    //     }
    //   });
    // } else {
    //   // Mode création
    //   this.identityPresetService.create(identityData, this.universeId).subscribe({
    //     next: (created) => {
    //       console.log('✅ Identité créée :', created);
    //       this.router.navigate(['..'], { relativeTo: this.route });
    //     },
    //     error: (err) => {
    //       console.error('❌ Erreur création :', err);
    //       this.isSaving = false;
    //     }
    //   });
    // }

    // Simulation pour tester le formulaire
    setTimeout(() => {
      console.log('✅ Sauvegarde simulée OK (service pas encore créé)');
      this.isSaving = false;
      // this.router.navigate(['..'], { relativeTo: this.route });
    }, 1000);
  }

  /**
   * ANNULATION
   */
  cancel(): void {
    console.log('❌ Annulation');
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  /**
   * Helper pour vérifier si le formulaire a l'erreur de validation custom
   * Utilisé dans le template pour afficher le message d'erreur
   */
  get hasAtLeastOneIdentityError(): boolean {
    return this.identityForm.touched &&
      this.identityForm.hasError('atLeastOneIdentityRequired');
  }
}
