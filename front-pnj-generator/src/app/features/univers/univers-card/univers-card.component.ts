import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Universe } from '../../../models/universe.models';

@Component({
  selector: 'app-univers-card',
  imports: [CommonModule],
  templateUrl: './univers-card.component.html',
  styleUrl: './univers-card.component.scss'
})
export class UniverseCardComponent {

  @Input({ required: true }) universe!: Universe;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  onView(): void {
    console.log('Universe card clicked:', this.universe);
    this.view.emit(this.universe.id);
  }
  onEdit(event: MouseEvent): void {
    event.stopPropagation(); // IMPORTANT : ne déclenche pas le clic de la card
    this.edit.emit(this.universe.id);
  }
}
