import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../../../models/features/equipment.models';
import { EquipmentService } from '../../../services/features/equipment.service';
import { UniverseContextService } from '../../../services/universe-context.service';

@Component({
  selector: 'app-equipment-card',
  imports: [CommonModule],
  templateUrl: './equipment-card.component.html',
  styleUrl: './equipment-card.component.scss'
})
export class EquipmentCardComponent implements OnInit {

  @Input({ required: true }) equipment!: Equipment;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly equipmentService = inject(EquipmentService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';

  ngOnInit(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();
    if (this.equipment == null) {
      var equipmentId: string | null = this.route.snapshot.paramMap.get('equipmentId');
      this.equipmentService.getEquipmentById(this.universeId,equipmentId!).subscribe({
        next: (equipment) => {
          this.equipment = equipment;
        },
        error: (error) => { }
      });
    }
  }

  onEdit(): void {
    console.log("Go to edit equipment:");
    this.edit.emit(this.equipment.id);
  }

  onDelete(): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${this.equipment.name}" ?`);
    if(confirmed)
      this.delete.emit(this.equipment.id);
  }

}
