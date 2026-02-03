import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeaponsListComponent } from '../weapons-list/weapons-list.component';
import { WeaponsEditComponent } from '../weapons-edit/weapons-edit.component';
import { WeaponsCardComponent } from '../weapons-card/weapons-card.component';
import { WEAPONS_ROUTES } from '../weapons.routes';

@Component({
  selector: 'app-weapons-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './weapons-shell.component.html',
  styleUrl: './weapons-shell.component.scss'
})
export class WeaponsShellComponent implements OnInit {

  ngOnInit(): void {
    console.log('WeaponsShellComponent initialized');
  }
}
