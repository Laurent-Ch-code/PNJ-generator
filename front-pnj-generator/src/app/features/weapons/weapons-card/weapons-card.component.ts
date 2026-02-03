import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Weapon } from '../../../models/weapon.models';

@Component({
  selector: 'app-weapons-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons-card.component.html',
  styleUrl: './weapons-card.component.scss'
})
export class WeaponsCardComponent {
  @Input({ required: true }) weapon!: Weapon;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onView(): void {
    console.log('Universe card clicked:', this.weapon);
    this.view.emit(this.weapon.id);
  }
  onEdit(event: MouseEvent): void {
    event.stopPropagation(); // IMPORTANT : ne déclenche pas le clic de la card
    this.edit.emit(this.weapon.id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation(); // IMPORTANT : ne déclenche pas le clic de la card
    this.delete.emit(this.weapon.id);
  }
}
