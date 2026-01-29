import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeaponsCrudComponent } from '../../weapons/weapons-crud/weapons-crud.component';


@Component({
  selector: 'app-universe-detail',
  imports: [WeaponsCrudComponent],
  templateUrl: './universe-detail.component.html',
  styleUrl: './universe-detail.component.scss'
})
export class UniverseDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  universeId: string | null = null;

  ngOnInit(): void {
    this.universeId = this.route.snapshot.paramMap.get('id');
  }
}
