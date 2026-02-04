import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';
import { EquipmentService } from '../../../services/equipment.service';
import { Equipment } from '../../../models/equipment.models';

@Component({
  selector: 'app-equipment-list',
  imports: [CommonModule, EquipmentCardComponent],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.scss'
})
export class EquipmentListComponent implements OnInit {
  private readonly equipmentService = inject(EquipmentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  equipments: Equipment[] = [];
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadEquipments();
  }

  /**
   * Charge la liste des équipements depuis le service
   */
  private loadEquipments(): void {
    this.equipmentService.getEquipments().subscribe({
      next: (data) => {
        this.equipments = data ?? [];
        console.log('✅ Équipements chargés:', this.equipments.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des équipements:', err);
        this.errorMessage = 'Impossible de charger les équipements';
      }
    });
  }

  /**
   * Navigation vers le formulaire de création d'un nouvel équipement
   */
  addEquipment(): void {
    console.log('Navigation vers le formulaire de création d\'un nouvel équipement');
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  /**
   * Navigation vers la page de détail d'un équipement
   * @param id
   */
  goToDetail(id: string): void {
    console.log('Navigation vers le détail de l\'équipement:', id);
    this.router.navigate([id], { relativeTo: this.route });
  }

  /**
   * Navigation vers le formulaire d'édition d'un équipement
   * @param id
   */
  goToEdit(id: string): void {
    console.log('Navigation vers l\'édition de l\'équipement:', id);
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Navigation vers la page de suppression d'un équipement
   */
  goToDelete(id: string): void {
    console.log('Suppression de l\'équipement:', id);
    this.equipmentService.deleteEquipment(id).subscribe({
      next: () => {
        console.log('✅ Équipement supprimé:', id);
        this.loadEquipments();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression de l\'équipement:', err);
        this.errorMessage = 'Impossible de supprimer l\'équipement';
      }
    });
  }

  /**
   * Fonction de tracking pour ngFor (optimisation performance)
   * @param index Index de l'élément
   * @param equipment Equipement
   * @returns L'ID unique de l'équipement
   */
  trackByEquipmentId(index: number, equipment: Equipment): string {
    return equipment.id;
  }
}
