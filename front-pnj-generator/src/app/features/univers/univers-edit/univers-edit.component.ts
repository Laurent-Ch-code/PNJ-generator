import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';
import { ModifierRules } from '../../../models/rules/modifier_rules.models';
import { ModifierRulesFormComponent } from '../../rules/modifier-rules-form/modifier-rules-form.component';
import { ModifierRuleService } from '../../../services/features/rules/modifier-rules.service';

@Component({
  selector: 'app-univers-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModifierRulesFormComponent],
  templateUrl: './univers-edit.component.html',
  styleUrl: './univers-edit.component.scss'
})
export class UniverseEditComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);
  private readonly modifierRuleService = inject(ModifierRuleService);

  // Référence vers le composant enfant pour valider/récupérer ses données
  @ViewChild('modifierRulesForm') modifierRulesForm?: ModifierRulesFormComponent;

  errorMessage: string | null = null;
  isEditMode = false;
  universeId: string | null = null;
  isSaving = false;
  activeTab = 0;
  modifierRulesFormValid = true;

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    era: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    diceRule: new FormControl('', { nonNullable: true }),
    hasModifiers: new FormControl(false, { nonNullable: true }),
  });

  existingRules: ModifierRules[] = [];

  ngOnInit(): void {
    this.universeId = this.route.snapshot.paramMap.get('universeId');
    this.isEditMode = !!this.universeId;

    if (!this.isEditMode || !this.universeId) return;

    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (universe) => {
        this.form.patchValue({
          name: universe.name,
          era: universe.era,
          description: universe.description,
          diceRule: universe.diceRule,
          hasModifiers: universe.hasModifiers,
        });

        // Dans ngOnInit, après le chargement de l'univers
        this.modifierRuleService.getByUniverse(universe.id).subscribe({
          next: (rules) => this.existingRules = rules
        });
      },
      error: () => this.router.navigate(['/universes'])
    });
  }


  onModifierRulesValidityChange(isValid: boolean): void {
    this.modifierRulesFormValid = isValid;
  }

  get hasModifiers(): boolean {
    return this.form.controls.hasModifiers.value;
  }

  onHasModifiersChange(): void {
    // Si on décoche, on reste sur l'onglet 1 et le composant enfant est détruit (*ngIf)
    // → ses données sont automatiquement perdues, pas besoin de reset manuel
    if (!this.hasModifiers) {
      this.activeTab = 0;
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Si modificateurs activés, valider le composant enfant avant de sauvegarder
    if (this.hasModifiers && this.modifierRulesForm) {
      if (!this.modifierRulesForm.isValid()) return;
    }

    const formValues = this.form.getRawValue();
    const universeData: Universe = {
      id: this.isEditMode ? this.universeId! : '',
      name: formValues.name,
      era: formValues.era,
      description: formValues.description,
      diceRule: formValues.diceRule,
      hasModifiers: formValues.hasModifiers,
      modifierType: this.hasModifiers ? this.modifierRulesForm?.modifierType : null
    };

    const rules = this.modifierRulesForm?.getRawRules() ?? [];

    // MODE ÉDITION
    if (this.isEditMode && this.universeId) {
      this.universeService.updateUniverse(universeData).subscribe({
        next: () => {
          // Suppression des anciennes règles
          forkJoin(
            this.existingRules.map(r => this.modifierRuleService.deleteModifierRule(this.universeId!, r.id))
          ).pipe(
            defaultIfEmpty([])
          ).subscribe(() => {

            // Si pas de nouvelles règles, navigation directe
            if (rules.length === 0) {
              this.router.navigate(['/universes', this.universeId]);
              return;
            }

            // Création des nouvelles règles
            forkJoin(
              rules.map(rule => this.modifierRuleService.createModifierRule(this.universeId!, rule))
            ).subscribe({
              next: () => {
                console.log("✅ Règles sauvegardées");
                this.router.navigate(['/universes', this.universeId]);
              },
              error: (err) => {
                console.error("❌ Erreur création règles:", err);
                this.router.navigate(['/universes', this.universeId]);
              }
            });
          });
        },
        error: (err: Error) => this.errorMessage = err.message
      });
      return;
    }

    // MODE CRÉATION
    this.universeService.addUniverse(universeData).subscribe({
      next: (created) => {
        console.log("Univers créé");

        // Si pas de règles, navigation directe
        if (rules.length === 0) {
          this.router.navigate(['/universes', created.id]);
          return;
        }

        // Création des règles
        forkJoin(
          rules.map(rule => {
            rule.universeId = created.id;
            return this.modifierRuleService.createModifierRule(created.id, rule);
          })
        ).subscribe({
          next: () => {
            console.log("✅ Règles créées");
            this.router.navigate(['/universes', created.id]);
          },
          error: (err) => {
            console.error("❌ Erreur création règles:", err);
            this.router.navigate(['/universes', created.id]);
          }
        });
      },
      error: (err: Error) => this.errorMessage = err.message
    });
  }

  cancel(): void {
    if (this.isEditMode && this.universeId) {
      this.router.navigate(['/universes', this.universeId]);
      return;
    }
    this.router.navigate(['/universes']);
  }
}
