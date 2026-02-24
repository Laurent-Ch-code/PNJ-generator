import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NPCService } from '../../../services/npc.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { CollapsiblePanelComponent } from '../../../shared/collapsible-panel/collapsible-panel.component';
import {
  NPC,
  IdentitySnapshot,
  CharacteristicSnapshot,
  SkillSnapshot,
  WeaponSnapshot,
  ProtectionSnapshot,
  EquipmentSnapshot,
  TraitSnapshot
} from '../../../models/features/npc.models';

@Component({
  selector: 'app-npcs-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CollapsiblePanelComponent],
  templateUrl: './npcs-edit.component.html',
  styleUrl: './npcs-edit.component.scss'
})
export class NPCsEditComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly npcService = inject(NPCService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';
  npcId: string = '';
  npc: NPC | null = null;
  isLoading = false;
  isSaving = false;
  isEditMode = false;

  // États des panels pliables
  panelsState = {
    weapons: true,      // replié par défaut
    protections: true,
    equipment: true,
    skills: true,
    traits: true,
    notes: true
  };

  // Snapshots parsés
  identity: IdentitySnapshot | null = null;
  characteristics: CharacteristicSnapshot[] = [];
  skills: SkillSnapshot[] = [];
  weapons: WeaponSnapshot[] = [];
  protections: ProtectionSnapshot[] = [];
  equipment: EquipmentSnapshot[] = [];
  traits: TraitSnapshot[] = [];

  // Formulaire pour édition caractéristiques
  characteristicsForm = new FormGroup({});

  // Formulaire pour HP, description physique, notes MJ
  editForm = new FormGroup({
    hp: new FormControl<number | null>(null),
    physicalDescription: new FormControl<string>('', { nonNullable: true }),
    gmNotes: new FormControl<string>('', { nonNullable: true })
  });

  ngOnInit(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();
    this.npcId = this.route.snapshot.paramMap.get('npcId')!;
    this.loadNPC();
  }

  loadNPC(): void {
    this.isLoading = true;
    this.npcService.getNPCById(this.universeId, this.npcId).subscribe({
      next: (npc) => {
        this.npc = npc;
        this.parseSnapshots();
        this.buildCharacteristicsForm();
        this.editForm.patchValue({
          hp: npc.hp ?? null,
          physicalDescription: npc.physicalDescription ?? '',
          gmNotes: npc.gmNotes ?? ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement NPC :', err);
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  parseSnapshots(): void {
    if (!this.npc) return;

    try {
      this.identity = JSON.parse(this.npc.identitySnapshot);
      this.characteristics = JSON.parse(this.npc.characteristicsSnapshot);
      this.skills = JSON.parse(this.npc.skillsSnapshot);
      this.weapons = JSON.parse(this.npc.weaponsSnapshot);
      this.protections = JSON.parse(this.npc.protectionsSnapshot);
      this.equipment = JSON.parse(this.npc.equipmentSnapshot);
      this.traits = JSON.parse(this.npc.traitsSnapshot);
    } catch (err) {
      console.error('❌ Erreur parsing snapshots :', err);
    }
  }

  buildCharacteristicsForm(): void {
    const group: any = {};
    this.characteristics.forEach((char, index) => {
      // Mode DiceCount
      if (char.nbDice !== undefined) {
        group[`char_${index}_nbDice`] = new FormControl(char.nbDice);
      }
      // Mode FixedValue
      if (char.value !== undefined) {
        group[`char_${index}_value`] = new FormControl(char.value);
      }
      // Modificateur pour les deux modes
      group[`char_${index}_modifier`] = new FormControl(char.modifier ?? 0);
    });
    this.characteristicsForm = new FormGroup(group);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Annulation — recharger les données
      this.buildCharacteristicsForm();
      this.editForm.patchValue({
        hp: this.npc?.hp ?? null,
        physicalDescription: this.npc?.physicalDescription ?? '',
        gmNotes: this.npc?.gmNotes ?? ''
      });
    }
  }

  save(): void {
    if (!this.npc) return;

    this.isSaving = true;

    // Mise à jour des caractéristiques depuis le formulaire
    const formValues: any = this.characteristicsForm.getRawValue();
    const updatedCharacteristics = this.characteristics.map((char, index) => ({
      ...char,
      nbDice: formValues[`char_${index}_nbDice`] ?? char.nbDice,
      value: formValues[`char_${index}_value`] ?? char.value,
      modifier: formValues[`char_${index}_modifier`] ?? char.modifier
    }));

    // Mise à jour des autres champs
    const editFormValues = this.editForm.getRawValue();

    const updatedNPC: NPC = {
      ...this.npc,
      characteristicsSnapshot: JSON.stringify(updatedCharacteristics),
      skillsSnapshot: JSON.stringify(this.skills),
      weaponsSnapshot: JSON.stringify(this.weapons),
      protectionsSnapshot: JSON.stringify(this.protections),
      equipmentSnapshot: JSON.stringify(this.equipment),
      traitsSnapshot: JSON.stringify(this.traits),
      hp: editFormValues.hp,
      physicalDescription: editFormValues.physicalDescription || null,
      gmNotes: editFormValues.gmNotes || null
    };

    this.npcService.updateNPC(this.universeId, updatedNPC).subscribe({
      next: (npc) => {
        this.npc = npc;
        this.parseSnapshots();
        this.isEditMode = false;
        this.isSaving = false;
      },
      error: (err) => {
        console.error('❌ Erreur sauvegarde :', err);
        this.isSaving = false;
      }
    });
  }

  // Retirer un élément de l'inventaire
  removeWeapon(index: number): void {
    this.weapons.splice(index, 1);
  }

  removeProtection(index: number): void {
    this.protections.splice(index, 1);
  }

  removeEquipment(index: number): void {
    this.equipment.splice(index, 1);
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  removeTrait(index: number): void {
    this.traits.splice(index, 1);
  }

  // Toggle panels pliables
  togglePanel(panel: keyof typeof this.panelsState): void {
    this.panelsState[panel] = !this.panelsState[panel];
  }

  cancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  deleteNPC(): void {
    if (!confirm('Supprimer ce NPC définitivement ?')) return;

    this.npcService.deleteNPC(this.universeId, this.npcId).subscribe({
      next: () => this.router.navigate(['..'], { relativeTo: this.route }),
      error: (err) => console.error('❌ Erreur suppression :', err)
    });
  }
}
