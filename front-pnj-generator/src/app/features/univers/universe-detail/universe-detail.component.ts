import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CardComponent } from '../../card/card.component';
import { UniverseService } from '../../../services/universe.service';
import { Universe } from '../../../models/universe.models';
import { UNIVERSES_FEATURE } from '../../features.config';
import { FeatureModels } from '../../../models/feature.models';

@Component({
  selector: 'app-universe-detail',
  imports: [CardComponent, CommonModule, RouterOutlet],
  templateUrl: './universe-detail.component.html',
  styleUrl: './universe-detail.component.scss'
})
export class UniverseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly universeService = inject(UniverseService);

  universeId!: string | null;
  universe!: Universe;
  errorMessage: string | null = null;
  features = UNIVERSES_FEATURE;


  ngOnInit(): void {
    this.universeId = this.route.snapshot.paramMap.get('id');
    this.universeService.getUniverseById(this.universeId || '').subscribe({
      next: (data) => {
        this.universe = data;
        console.log(this.features);
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger l\'univers demandé.';
      }
    });
  }

  goToFeature(feature: FeatureModels) {
    this.router.navigate(
      [{ outlets: { feature: [feature.route] } }],
      { relativeTo: this.route }
    );
  }
}
