import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-weapons-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './weapons-shell.component.html',
  styleUrl: './weapons-shell.component.scss'
})
export class WeaponsShellComponent {

}
