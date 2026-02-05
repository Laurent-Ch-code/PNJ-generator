import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-traits-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './traits-shell.component.html',
  styleUrl: './traits-shell.component.scss'
})
export class TraitsShellComponent {

}
