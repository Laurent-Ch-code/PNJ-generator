import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../../models/features/equipment.models';
import { Universe } from '../../../models/universe.models';
import { UniverseService } from '../../../services/universe.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { EquipmentService } from '../../../services/features/equipment.service';

@Component({
  selector: 'app-equipment-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipment-edit.component.html',
  styleUrl: './equipment-edit.component.scss'
})
export class EquipmentEditComponent implements OnInit {

  equipmentId: string | null = null;
  universeId: string = '';
  isEditMode = false;
  isSaving = false;
  universe: Universe | null = null;

  equipmentForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    bonus: new FormControl('', { nonNullable: true }),
    malus: new FormControl('', { nonNullable: true }),
  });

  private readonly equipmentService = inject(EquipmentService);
  private readonly universeService = inject(UniverseService);
  private readonly universeContextService = inject(UniverseContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.equipmentId = this.route.snapshot.paramMap.get('equipmentId');
    this.isEditMode = !!this.equipmentId;

    this.universeId = this.universeContextService.requireCurrentUniverseId();

    // Si on n'a pas trouvé d'universeId, il y a un problème de routing
    if (!this.universeId) {
      console.error('❌ Aucun universeId trouvé dans les routes !');
      console.error('Vérifiez que la route est bien configurée avec :universeId');
      this.router.navigate(['/universes']);
      return;
    }

    this.loadUniverse();
    if (this.isEditMode && this.equipmentId) {
      this.loadEquipment(this.equipmentId);
    }
  }

  private loadUniverse(): void {
    this.universeService.getUniverseById(this.universeId).subscribe({
      next: (data) => {
        this.universe = data;
        console.log('✅ Univers chargé pour l\'équipement:', this.universe);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'univers:', err);
        this.router.navigate(['/universes']);
      }
    });
  }

  private loadEquipment(id: string): void {
    if (!this.equipmentId) return;

    this.equipmentService.getEquipmentById(this.universeId,this.equipmentId).subscribe({
      next: (data) => {
        console.log('✅ Équipement chargé:', data);
        this.equipmentForm.patchValue({
          name: data.name,
          type: data.type,
          description: data.description || '',
          bonus: data.bonus || '',
          malus: data.malus || '',
        });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'équipement:', err);
        this.router.navigate(['../..'], { relativeTo: this.route });
      }
    });
  }

  save(): void {
    if (this.equipmentForm.invalid) {
      console.warn('❌ Formulaire invalide, impossible de sauvegarder.');
      this.equipmentForm.markAllAsTouched();
      return;
    }
    const formValue = this.equipmentForm.value;

    const equipmentData: Equipment = {
      id: this.isEditMode ? this.equipmentId! : '',
      name: formValue.name ?? '',
      type: formValue.type ?? '',
      description: formValue.description || undefined,
      universeId: this.universeId,
      bonus: formValue.bonus || undefined,
      malus: formValue.malus || undefined
    };
    this.isSaving = true;

    if (this.isEditMode && this.equipmentId) {
      this.equipmentService.updateEquipment(this.universeId,equipmentData).subscribe({
        next: (updated) => {
          console.log('✅ Équipement mis à jour avec succès.', updated, "this.router", this.router);
          this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour de l\'équipement:', err);
        }
      });
    } else {
      this.equipmentService.createEquipment(this.universeId,equipmentData).subscribe({
        next: (created) => {
          console.log('✅ Arme créée avec succès :', created);
          // Retour à la liste des équipements
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création :', err);
        }
      });
    }
  }

  cancel(): void {
    console.log('❌ Annulation de l\'édition');
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
