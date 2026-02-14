import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from '../../../models/features/identity/identity.enums';
import { Alignment, Culture, Species, Origin, IdentityCreateDTO } from '../../../models/features/identity/identity.models';
import { UniverseContextService } from '../../../services/universe-context.service';
import { UniverseService } from '../../../services/universe.service';
import { IdentityService } from '../../../services/features/identity/identity.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-identities-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './identities-edit.component.html',
  styleUrl: './identities-edit.component.scss'
})
export class IdentitiesEditComponent implements OnInit {

  identityId: string | null = null;
  universeId: string = '';
  isEditMode = false;
  isSaving = false;
  universe!: Universe;

  /**
   * FORMULAIRE RÉACTIF
   *
   * Les champs culture/specie/alignment/origin sont des champs TEXTE libres.
   * L'utilisateur peut taper une valeur existante (suggérée via datalist)
   * ou en créer une nouvelle — le back fait le GetOrCreate dans tous les cas.
   *
   * RÈGLES :
   * - gender : obligatoire
   * - Au moins 1 parmi firstName, name, alias (validator custom)
   * - Tout le reste : optionnel
   */
  identityForm = new FormGroup({
    // Genre (obligatoire)
    gender: new FormControl<Gender | null>(null, { validators: [Validators.required] }),

    // Fragments d'identité (au moins 1 requis via validator custom)
    firstName: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),  // → mappé vers `name` dans le DTO back
    alias: new FormControl('', { nonNullable: true }),  // → mappé vers `alias` dans le DTO back

    // Infos additionnelles — valeurs texte libres, le back fait le GetOrCreate
    cultureName: new FormControl('', { nonNullable: true }),
    specieName: new FormControl('', { nonNullable: true }),
    alignmentName: new FormControl('', { nonNullable: true }),
    originName: new FormControl('', { nonNullable: true }),

    // Champs pour les futures versions (pas encore dans le DTO back)
    age: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true })
  }, {
    validators: [this.atLeastOneIdentityValidator()]
  });

  // Enum exposé pour le template
  Gender = Gender;

  genderOptions = [
    { value: Gender.Male, label: 'Masculin' },
    { value: Gender.Female, label: 'Féminin' },
    { value: Gender.Neutral, label: 'Neutre' }
  ];

  // Listes pour les datalists (chargées depuis le back)
  cultures: Culture[] = [];
  species: Species[] = [];
  alignments: Alignment[] = [];
  origins: Origin[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly identityService = inject(IdentityService);

  ngOnInit(): void {
    this.identityId = this.route.snapshot.paramMap.get('identityId');
    this.isEditMode = !!this.identityId;
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.loadUniverse();
    // TODO: this.loadDropdownData() — à activer quand les services cultures/species/etc. seront prêts

    if (this.isEditMode && this.identityId) {
      this.loadIdentity();
    }
  }

  /**
   * Validator custom : au moins 1 champ d'identité requis
   */
  private atLeastOneIdentityValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const firstName = group.get('firstName')?.value?.trim();
      const name = group.get('name')?.value?.trim();
      const alias = group.get('alias')?.value?.trim();

      if (firstName || name || alias) return null;
      return { atLeastOneIdentityRequired: true };
    };
  }

  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (u) => this.universe = u,
      error: (err) => {
        console.error('❌ Erreur chargement univers :', err);
        this.router.navigate(['/universes']);
      }
    });
  }

  private loadIdentity(): void {
    if (!this.identityId) return;
    console.log("loadIdentity", this.identityId);

    this.identityService.getIdentityById(this.universeId, this.identityId).subscribe({
      next: (identity) => {
        this.identityForm.patchValue({
          gender: identity.gender,
          firstName: identity.firstName?.value ?? '',
          name: identity.name?.value ?? '',
          alias: identity.alias?.value ?? '',
          cultureName: identity.culture?.value ?? '',
          specieName: identity.specie?.value ?? '',
          alignmentName: identity.alignment?.value ?? '',
          originName: identity.origin?.value ?? '',
          age: identity.age ?? null,
          description: identity.description ?? '',
        });
        console.log("identity", identity, "formValue", this.identityForm );
      },
      error: (err) => {
        console.error('❌ Erreur chargement identité :', err);
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  /**
   * Helper : construit un FragmentIdentityDTO si la valeur est renseignée
   */
  private toFragment(value: string): { value: string; universeId: string } | undefined {
    const trimmed = value.trim();
    return trimmed ? { value: trimmed, universeId: this.universeId } : undefined;
  }

  /**
   * Helper : construit un AdditionnalInformationDTO si la valeur est renseignée
   */
  private toAdditionalInfo(value: string, gender: Gender): { value: string; universeId: string; gender: Gender } | undefined {
    const trimmed = value.trim();
    return trimmed ? { value: trimmed, universeId: this.universeId, gender } : undefined;
  }

  save(): void {
    if (this.identityForm.invalid) {
      this.identityForm.markAllAsTouched();
      return;
    }

    const v = this.identityForm.getRawValue();
    const gender = v.gender!;

    // Construction du DTO — miroir exact de IdentityCreateDTO C#
    const dto: IdentityCreateDTO = {
      universeId: this.universeId,
      gender,
      firstName: this.toFragment(v.firstName),
      name: this.toFragment(v.name),
      alias: this.toFragment(v.alias),
      culture: this.toAdditionalInfo(v.cultureName, gender),
      specie: this.toAdditionalInfo(v.specieName, gender),
      alignment: this.toAdditionalInfo(v.alignmentName, gender),
      origin: this.toAdditionalInfo(v.originName, gender),
      age: v.age ?? undefined,
      description: v.description || undefined,
    };

    this.isSaving = true;

    const call = this.isEditMode && this.identityId
      ? this.identityService.update(this.universeId, this.identityId, dto)
      : this.identityService.create(this.universeId, dto);

    call.subscribe({
      next: () => this.router.navigate(
        this.isEditMode ? ['../..'] : ['..'],
        { relativeTo: this.route }
      ),
      error: (err) => {
        console.error('❌ Erreur sauvegarde :', err);
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  get hasAtLeastOneIdentityError(): boolean {
    return this.identityForm.touched &&
      this.identityForm.hasError('atLeastOneIdentityRequired');
  }
} 
