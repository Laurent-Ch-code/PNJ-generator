import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeaponsCardComponent } from '../weapons-card/weapons-card.component';
import { WeaponService } from '../../../services/weapon.service';
import { Weapon } from '../../../models/weapon.models';

@Component({
  selector: 'app-weapons-list',
  standalone: true,
  imports: [CommonModule, WeaponsCardComponent],
  templateUrl: './weapons-list.component.html',
  styleUrl: './weapons-list.component.scss'
})
export class WeaponsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly weaponService = inject(WeaponService);
  weapons: Weapon[] = [];
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.weaponService.getWeapons().subscribe((data) => {
      this.weapons = data ?? [];
    });
  }

  addWeapon(): void { }

  goToDetail(id: string): void { }
  goToEdit(id: string): void { }
  goToDelete(id: string): void { }
  trackByWeaponId(index: number, weapon: Weapon): Weapon['id'] {
    return weapon.id;
  }
}
