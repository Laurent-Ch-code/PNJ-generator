import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Identity } from '../../../models/features/identity/identity.models';
import { Gender } from '../../../models/features/identity/identity.enums';

@Component({
  selector: 'app-identities-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identities-card.component.html',
  styleUrl: './identities-card.component.scss'
})
export class IdentitiesCardComponent {

  @Input({ required: true }) identity!: Identity;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.identity.id);
  }

  onDelete(): void {
    const fullName = this.getFullName();
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${fullName}" ?`);
    if (confirmed) {
      this.delete.emit(this.identity.id);
    }
  }

  /**
   * Construit le nom complet affiché en titre de la card
   * Prend ce qui est disponible parmi prénom, nom, alias
   */
  getFullName(): string {
    const parts = [
      this.identity.firstName?.value,
      this.identity.name?.value
    ].filter(Boolean);

    if (parts.length > 0) return parts.join(' ');
    if (this.identity.alias?.value) return this.identity.alias.value;

    return 'Identité sans nom';
  }

  getGenderLabel(gender: Gender): string {
    switch (gender) {
      case Gender.Male: return 'Masculin';
      case Gender.Female: return 'Féminin';
      case Gender.Neutral: return 'Neutre';
      default: return 'Inconnu';
    }
  }

  getGenderIcon(gender: Gender): string {
    switch (gender) {
      case Gender.Male: return 'bi-gender-male';
      case Gender.Female: return 'bi-gender-female';
      case Gender.Neutral: return 'bi-gender-ambiguous';
      default: return 'bi-person';
    }
  }
} 
