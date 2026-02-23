import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NPCService } from '../../../services/npc.service';
import { UniverseContextService } from '../../../services/universe-context.service';
import { NPC } from '../../../models/features/npc.models';
import { NPCsCardComponent } from '../npcs-card/npcs-card.component';

@Component({
  selector: 'app-npcs-list',
  standalone: true,
  imports: [CommonModule, NPCsCardComponent],
  templateUrl: './npcs-list.component.html',
  styleUrl: './npcs-list.component.scss'
})
export class NPCsListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly npcService = inject(NPCService);
  private readonly universeContextService = inject(UniverseContextService);

  universeId: string = '';
  npcs: NPC[] = [];
  isLoading = false;
  isGenerating = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.universeId = this.universeContextService.requireCurrentUniverseId();
    this.loadNPCs();
  }

  loadNPCs(): void {
    this.isLoading = true;
    this.npcService.getNPCs(this.universeId).subscribe({
      next: (npcs) => {
        this.npcs = npcs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement NPCs :', err);
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  generateNPC(): void {
    this.isGenerating = true;
    this.errorMessage = null;

    this.npcService.generateNPC(this.universeId).subscribe({
      next: (npc) => {
        console.log('✅ NPC généré :', npc);
        this.npcs = [npc, ...this.npcs]; // Ajoute en tête de liste
        this.isGenerating = false;
      },
      error: (err) => {
        console.error('❌ Erreur génération NPC :', err);
        this.errorMessage = err.message;
        this.isGenerating = false;
      }
    });
  }

  viewNPC(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  deleteNPC(id: string): void {
    if (!confirm('Supprimer ce NPC ?')) return;

    this.npcService.deleteNPC(this.universeId, id).subscribe({
      next: () => {
        this.npcs = this.npcs.filter(n => n.id !== id);
      },
      error: (err) => console.error('❌ Erreur suppression :', err)
    });
  }
}
