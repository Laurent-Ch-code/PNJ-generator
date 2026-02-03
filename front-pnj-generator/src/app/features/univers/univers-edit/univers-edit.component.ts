import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-univers-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './univers-edit.component.html',
  styleUrl: './univers-edit.component.scss'
})
export class UniverseEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);
  errorMessage: string | null = null;

  isEditMode = false;
  universeId: string | null = null;
  isSaving = false;

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    era: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    diceRule: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.universeId = this.route.snapshot.paramMap.get('universeId');
    this.isEditMode = !!this.universeId;

    if (!this.isEditMode || !this.universeId) return;

    if (this.isEditMode) {
      this.universeService.getUniverseById(this.universeId).subscribe({
        next: (universe) => this.form.patchValue({
          name: universe.name,
          era: universe.era,
          description: universe.description,
          diceRule: universe.diceRule,
        }),
        error: () => {
          // si id invalide : retour liste (ou 404)
          this.router.navigate(['/universes']);
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue(); // {name, era, description, diceRule}

    if (this.isEditMode && this.universeId) {
      const updatedUniverse: Universe = {
        id: this.universeId,
        ...formValue,
      };

      this.universeService.updateUniverse(updatedUniverse).subscribe({
        next: () => this.router.navigate(['/universes', updatedUniverse.id]),
        error: (err: Error) => this.errorMessage = err.message
      });
      return;
    }

    this.universeService.addUniverse(formValue).subscribe({
      next: (createdUniverse) => this.router.navigate(['/universes', createdUniverse.id]),
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
