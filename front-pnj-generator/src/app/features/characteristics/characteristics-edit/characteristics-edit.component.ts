import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Characteristic } from '../../../models/features/characteristic.models';
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

  @ViewChild('modifierRulesForm') modifierRulesForm?: ModifierRulesFormComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characteristicService = inject(CharacteristicService);
  private readonly universeService = inject(UniverseService);
  private readonly modifierRuleService = inject(ModifierRuleService);
  private readonly universeContextService = inject(UniverseContextService);

  characteristicForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    diceType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    minDice: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    maxDice: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true }),
    hasModifiers: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.characteristicId = this.route.snapshot.paramMap.get('characteristicId');
    this.isEditMode = !!this.characteristicId;
    this.universeId = this.universeContextService.requireCurrentUniverseId();

    this.loadUniverse(); // loadExistingRules est appelé dedans

    console.log("isEditMode ?", this.isEditMode, "caractID", this.characteristicId);

    if (this.isEditMode && this.characteristicId) {
      this.loadCharacteristic(); // uniquement loadCharacteristic ici
    }
  }

  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.universe = universe;

        if (!this.isEditMode && universe.hasModifiers) {
          this.characteristicForm.controls.hasModifiers.setValue(true);
        }

        // Universe chargé → on peut maintenant charger les règles
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
          diceType: characteristic.diceType,
          minDice: characteristic.minDice,
          maxDice: characteristic.maxDice ?? null,
          description: characteristic.description ?? '',
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
            next: (universeRules) => {
              this.existingRules = universeRules;
              this.characteristicForm.controls.hasModifiers.setValue(true);
            }
          });
        }
      },
      error: (err) => console.error('❌ Erreur chargement règles :', err)
    });
  }

  get hasModifiers(): boolean {
    return this.characteristicForm.controls.hasModifiers.value;
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
      diceType: formValues.diceType,
      minDice: formValues.minDice!,
      maxDice: formValues.maxDice ?? null,
      description: formValues.description,
      hasModifiers: formValues.hasModifiers,
    };

    if (this.isEditMode && this.characteristicId) {
      this.characteristicService.updateCharacteristic(this.universeId, characteristicData).subscribe({
        next: () => {
          this.saveRules(this.characteristicId!);
          this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (err) => console.error('❌ Erreur mise à jour :', err)
      });
    } else {
      this.characteristicService.createCharacteristic(this.universeId, characteristicData).subscribe({
        next: (created) => {
          this.saveRules(created.id);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => console.error('❌ Erreur création :', err)
      });
    }
  }

  // Supprime les anciennes règles et recrée les nouvelles
  private saveRules(characteristicId: string): void {
    if (!this.hasModifiers || !this.modifierRulesForm) return;

    const rules = this.modifierRulesForm.getRawRules();

    forkJoin(
      this.existingRules.map(r => this.modifierRuleService.deleteModifierRule(this.universeId, r.id))
    ).pipe(defaultIfEmpty([])).subscribe(() => {
      rules.forEach(rule => this.modifierRuleService.createModifierRule(this.universeId, rule).subscribe());
    });
  }

  cancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
