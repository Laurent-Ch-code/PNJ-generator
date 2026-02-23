import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NPC, IdentitySnapshot } from '../../../models/features/npc.models';

@Component({
  selector: 'app-npcs-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './npcs-card.component.html',
  styleUrl: './npcs-card.component.scss'
})
export class NPCsCardComponent {

  @Input({ required: true }) npc!: NPC;
  @Output() view = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onView(): void {
    this.view.emit(this.npc.id);
  }

  onDelete(): void {
    this.delete.emit(this.npc.id);
  }

  // Parse l'identité pour affichage
  get identity(): IdentitySnapshot | null {
    try {
      return JSON.parse(this.npc.identitySnapshot);
    } catch {
      return null;
    }
  }

  // Compte les caractéristiques
  get characteristicsCount(): number {
    try {
      return JSON.parse(this.npc.characteristicsSnapshot).length;
    } catch {
      return 0;
    }
  }
}
