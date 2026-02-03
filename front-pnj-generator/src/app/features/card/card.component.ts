import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FeatureModels } from '../../models/feature.models';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @Input() feature!: FeatureModels;
  @Input() universeId!: string;
  @Output() featureSelected = new EventEmitter<FeatureModels>();

  onClick() {
    console.log('Card clicked:', this.feature);
    this.featureSelected.emit(this.feature);
  }
}
