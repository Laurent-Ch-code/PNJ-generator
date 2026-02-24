import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Characteristic, CharacteristicGenerationType } from '../../../models/features/characteristic.models';
import { ModifierRules } from '../../../models/rules/modifier_rules.models';
import { UniverseService } from '../../../services/universe.service';
import { CharacteristicService } from '../../../services/features/characteristic.service';
import { ModifierRuleService } from '../../../services/features/rules/modifier-rules.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { Universe } from '../../../models/universe.models';
import { ModifierRulesFormComponent } from '../../rules/modifier-rules-form/modifier-rules-form.component';

@Component({
  selector: 'app-characteristics-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModifierRulesFormComponent],
  templateUrl: './characteristics-edit.component.html',
  styleUrl: './characteristics-edit.component.scss'
})
export class CharacteristicsEditComponent implements OnInit {

  characteristicId: string | null = null;
  universeId: string = '';
  isEditMode = false;
  isSaving = false;
  activeTab = 0;

  universe!: Universe;
  existingRules: ModifierRules[] = [];
  modifierRulesFormValid = true;

  // Enum exposé pour le template
  CharacteristicGenerationType = CharacteristicGenerationType;

  @ViewChild('modifierRulesForm') modifierRulesForm?: ModifierRulesFormComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characteristicService = inject(CharacteristicService);
  private readonly universeService = inject(UniverseService);
  private readonly modifierRuleService = inject(ModifierRuleService);
  private readonly universeContextService = inject(UniverseContextService);

  characteristicForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    generationType: new FormControl<CharacteristicGenerationType>(CharacteristicGenerationType.DiceCount, { nonNullable: true }),

    // Mode DiceCount
    diceType: new FormControl('', { nonNullable: true }),
    minDice: new FormControl<number | null>(null),
    maxDice: new FormControl<number | null>(null),

    // Mode FixedValue
    minValue: new FormControl<number | null>(null),
    maxValue: new FormControl<number | null>(null),

    hasModifiers: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.characteristicId = this.route.snapshot.paramMap.get('characteristicId');
    this.isEditMode = !!this.characteristicId;
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Appliquer les validators selon le mode par défaut
    this.updateValidators();

    // Réappliquer les validators quand le type change
    this.characteristicForm.controls.generationType.valueChanges.subscribe(() => {
      this.updateValidators();
    });

    this.loadUniverse();

    if (this.isEditMode && this.characteristicId) {
      this.loadCharacteristic();
    }
  }

  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.universe = universe;
        if (!this.isEditMode && universe.hasModifiers) {
          this.characteristicForm.controls.hasModifiers.setValue(true);
          // Charger les règles univers pour pré-remplir
          this.modifierRuleService.getByUniverse(this.universeId).subscribe({
            next: (rules) => this.existingRules = rules
          });
        }
        if (this.isEditMode && this.characteristicId) {
          this.loadExistingRules();
        }
      },
      error: () => this.router.navigate(['/universes'])
    });
  }

  private loadCharacteristic(): void {
    if (!this.characteristicId) return;

    this.characteristicService.getCharacteristicById(this.universeId, this.characteristicId).subscribe({
      next: (characteristic) => {
        this.characteristicForm.patchValue({
          name: characteristic.name,
          description: characteristic.description ?? '',
          generationType: characteristic.generationType,
          diceType: characteristic.diceType ?? '',
          minDice: characteristic.minDice ?? null,
          maxDice: characteristic.maxDice ?? null,
          minValue: characteristic.minValue ?? null,
          maxValue: characteristic.maxValue ?? null,
          hasModifiers: characteristic.hasModifiers,
        });
      },
      error: () => this.router.navigate(['../..'], { relativeTo: this.route })
    });
  }

  private loadExistingRules(): void {
    this.modifierRuleService.getByCharacteristic(this.universeId, this.characteristicId!).subscribe({
      next: (rules) => {
        if (rules.length > 0) {
          this.existingRules = rules;
        } else if (this.universe.hasModifiers) {
          this.modifierRuleService.getByUniverse(this.universeId).subscribe({
            next: (universeRules) => this.existingRules = universeRules
          });
        }
      },
      error: (err) => console.error('❌ Erreur chargement règles caract :', err)
    });
  }

  // Mettre à jour les validators selon le mode
  private updateValidators(): void {
    const generationType = this.characteristicForm.controls.generationType.value;

    if (generationType === CharacteristicGenerationType.DiceCount) {
      // Mode DiceCount → diceType et minDice requis
      this.characteristicForm.controls.diceType.setValidators([Validators.required]);
      this.characteristicForm.controls.minDice.setValidators([Validators.required, Validators.min(1)]);
      this.characteristicForm.controls.maxDice.clearValidators();

      // Mode FixedValue → pas requis
      this.characteristicForm.controls.minValue.clearValidators();
      this.characteristicForm.controls.maxValue.clearValidators();
    } else {
      // Mode FixedValue → minValue et maxValue requis
      this.characteristicForm.controls.minValue.setValidators([Validators.required, Validators.min(1)]);
      this.characteristicForm.controls.maxValue.setValidators([Validators.required, Validators.min(1)]);

      // Mode DiceCount → pas requis
      this.characteristicForm.controls.diceType.clearValidators();
      this.characteristicForm.controls.minDice.clearValidators();
      this.characteristicForm.controls.maxDice.clearValidators();
    }

    // Recalculer la validité
    this.characteristicForm.controls.diceType.updateValueAndValidity();
    this.characteristicForm.controls.minDice.updateValueAndValidity();
    this.characteristicForm.controls.maxDice.updateValueAndValidity();
    this.characteristicForm.controls.minValue.updateValueAndValidity();
    this.characteristicForm.controls.maxValue.updateValueAndValidity();
  }

  get hasModifiers(): boolean {
    return this.characteristicForm.controls.hasModifiers.value;
  }

  get isDiceCountMode(): boolean {
    return this.characteristicForm.controls.generationType.value === CharacteristicGenerationType.DiceCount;
  }

  onHasModifiersChange(): void {
    if (!this.hasModifiers) {
      this.activeTab = 0;
    }
  }

  onModifierRulesValidityChange(isValid: boolean): void {
    this.modifierRulesFormValid = isValid;
  }

  save(): void {
    if (this.characteristicForm.invalid) {
      this.characteristicForm.markAllAsTouched();
      return;
    }

    if (this.hasModifiers && this.modifierRulesForm) {
      if (!this.modifierRulesForm.isValid()) return;
    }

    const formValues = this.characteristicForm.getRawValue();

    const characteristicData: Characteristic = {
      id: this.isEditMode ? this.characteristicId! : '',
      universeId: this.universeId,
      name: formValues.name,
      description: formValues.description,
      generationType: formValues.generationType,
      diceType: formValues.diceType || null,
      minDice: formValues.minDice ?? null,
      maxDice: formValues.maxDice ?? null,
      minValue: formValues.minValue ?? null,
      maxValue: formValues.maxValue ?? null,
      hasModifiers: formValues.hasModifiers,
    };

    if (this.isEditMode && this.characteristicId) {
      this.characteristicService.updateCharacteristic(this.universeId, characteristicData).subscribe({
        next: () => {
          // Ne sauvegarder des règles spécifiques QUE si hasModifiers = true
          if (formValues.hasModifiers) {
            this.saveRules(this.characteristicId!);
          } else {
            // Supprimer les règles spécifiques existantes si on désactive hasModifiers
            this.deleteExistingRules();
          }
          this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (err) => console.error('❌ Erreur mise à jour :', err)
      });
    } else {
      this.characteristicService.createCharacteristic(this.universeId, characteristicData).subscribe({
        next: (created) => {
          // Ne sauvegarder des règles spécifiques QUE si hasModifiers = true
          if (formValues.hasModifiers) {
            this.saveRules(created.id);
          }
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => console.error('❌ Erreur création :', err)
      });
    }
  }

  // Supprime les anciennes règles spécifiques et recrée les nouvelles
  private saveRules(characteristicId: string): void {
    if (!this.modifierRulesForm) return;

    const rules = this.modifierRulesForm.getRawRules();

    // Supprimer les anciennes règles spécifiques
    forkJoin(
      this.existingRules
        .filter(r => r.characteristicId !== null) // Ne supprimer QUE les règles spécifiques
        .map(r => this.modifierRuleService.deleteModifierRule(this.universeId, r.id))
    ).pipe(defaultIfEmpty([])).subscribe(() => {
      if (rules.length === 0) return;

      // Créer les nouvelles règles spécifiques
      forkJoin(
        rules.map(rule => {
          rule.universeId = this.universeId;
          rule.characteristicId = characteristicId; // Lier à la caractéristique
          return this.modifierRuleService.createModifierRule(this.universeId, rule);
        })
      ).subscribe({
        next: () => console.log("✅ Règles spécifiques sauvegardées"),
        error: (err) => console.error("❌ Erreur sauvegarde règles:", err)
      });
    });
  }

  // Supprime les règles spécifiques existantes (quand on désactive hasModifiers)
  private deleteExistingRules(): void {
    const specificRules = this.existingRules.filter(r => r.characteristicId !== null);
    if (specificRules.length === 0) return;

    forkJoin(
      specificRules.map(r => this.modifierRuleService.deleteModifierRule(this.universeId, r.id))
    ).subscribe({
      next: () => console.log("✅ Règles spécifiques supprimées"),
      error: (err) => console.error("❌ Erreur suppression règles:", err)
    });
  }

  cancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
