import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ModifierRules, ModifierType } from '../../../models/rules/modifier_rules.models';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-modifier-rules-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modifier-rules-form.component.html',
  styleUrl: './modifier-rules-form.component.scss'
})
export class ModifierRulesFormComponent implements OnInit, OnChanges {

  // Contexte — détermine si les règles sont globales (univers) ou spécifiques (caract)
  @Input({ required: true }) universeId!: string;
  @Input() characteristicId?: string | null;
  @Input() existingRules: ModifierRules[] = [];

  @Output() validityChange = new EventEmitter<boolean>();

  // Enum exposé pour le template
  ModifierType = ModifierType;

  form = new FormGroup({
    modifierType: new FormControl<ModifierType>(ModifierType.RangeTable, { nonNullable: true }),
    rules: new FormArray<FormGroup>([], [this.atLeastOneRuleValidator()])
  });

  ngOnInit(): void {
    console.log('existingRules', this.existingRules);
    if (this.existingRules.length > 0) {
      this.form.controls.modifierType.setValue(this.existingRules[0].type);
      this.existingRules.forEach(rule => this.rules.push(this.buildRuleGroup(rule)));
    }

    this.form.statusChanges.subscribe(() => {
      this.validityChange.emit(this.form.valid);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const rules = changes['existingRules']?.currentValue;
    if (rules && rules.length > 0) {
      this.form.controls.modifierType.setValue(rules[0].type);
      this.rules.clear();
      rules.forEach((rule: ModifierRules) => this.rules.push(this.buildRuleGroup(rule)));
    }
  }

  // --- Accès rapide ---
  get rules(): FormArray<FormGroup> {
    return this.form.get('rules') as FormArray<FormGroup>;
  }

  get modifierType(): ModifierType {
    return this.form.controls.modifierType.value;
  }

  // --- Validator : au moins une ligne si le composant est affiché ---
  private atLeastOneRuleValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array.length > 0 ? null : { atLeastOneRule: true };
    };
  }

  // --- Construction d'une ligne avec validators selon le type actuel ---
  private buildRuleGroup(defaults?: Partial<ModifierRules>): FormGroup {
    if (this.modifierType === ModifierType.RangeTable) {
      return new FormGroup({
        rangeMin: new FormControl<number | null>(defaults?.rangeMin ?? null, [Validators.required]),
        rangeMax: new FormControl<number | null>(defaults?.rangeMax ?? null, [Validators.required]),
        modifier: new FormControl<number | null>(defaults?.modifier ?? null, [Validators.required]),
        availableValue: new FormControl<number | null>(null),
      });
    } else {
      return new FormGroup({
        availableValue: new FormControl<number | null>(defaults?.availableValue ?? null, [Validators.required]),
        rangeMin: new FormControl<number | null>(null),
        rangeMax: new FormControl<number | null>(null),
        modifier: new FormControl<number | null>(null),
      });
    }
  }

  addRule(): void {
    this.rules.push(this.buildRuleGroup());
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  // Reset des lignes quand on change de type — les champs requis changent
  onTypeChange(): void {
    this.rules.clear();
  }

  // --- Helpers pour le template ---
  isRuleInvalid(index: number, field: string): boolean {
    const control = this.rules.at(index)?.get(field);
    return !!control && control.touched && control.invalid;
  }

  // --- Récupération des valeurs pour le composant parent ---
  getRawRules(): ModifierRules[] {
    return this.rules.controls.map(rule => ({
      id: '',
      universeId: this.universeId,
      characteristicId: this.characteristicId ?? null,
      type: this.modifierType,
      rangeMin: rule.get('rangeMin')?.value,
      rangeMax: rule.get('rangeMax')?.value,
      modifier: rule.get('modifier')?.value,
      availableValue: rule.get('availableValue')?.value,
    }));
  }

  isValid(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
}
