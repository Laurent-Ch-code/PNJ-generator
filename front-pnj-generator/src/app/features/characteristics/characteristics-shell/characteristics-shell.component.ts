import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-characteristics-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './characteristics-shell.component.html',
  styleUrl: './characteristics-shell.component.scss'
})
export class CharacteristicsShellComponent {

}
