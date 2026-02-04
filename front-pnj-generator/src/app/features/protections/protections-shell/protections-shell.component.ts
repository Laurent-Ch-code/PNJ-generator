import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-protections-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './protections-shell.component.html',
  styleUrl: './protections-shell.component.scss'
})
export class ProtectionsShellComponent {

}
