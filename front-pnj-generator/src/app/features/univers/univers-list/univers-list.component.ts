import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';
import { UniverseCardComponent } from '../univers-card/univers-card.component';

@Component({
  selector: 'app-universe-list',
  standalone: true,
  imports: [CommonModule, UniverseCardComponent],
  templateUrl: './univers-list.component.html',
})
export class UniversesListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);

  universes: Universe[] = [];
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.universeService.getUniverses().subscribe({
      next: (universes) => {
        this.universes = universes ?? [];
        this.errorMessage = null;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.universes = [];
      }
    });
  }

  addUniverse(): void {
    console.log('Navigating to add new universe');
    this.router.navigate(['/universes/new']);
  }

  goToDetail(id: string): void {
    console.log('Navigating to universe detail with id:', id);
    this.router.navigate(['/universes', id]);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/universes', id, 'edit']);
  }

  trackByUniverseId(index: number, universe: Universe): Universe['id'] {
    return universe.id;
  }

  goToDelete(id: string): void {
    this.universeService.deleteUniverse(id).subscribe({
      next: () => this.universes = this.universes.filter(u => u.id !== id),
      error: (err: Error) => {
        this.errorMessage = err.message;
      }
    });
  }
}
