import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-skills-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './skills-shell.component.html',
  styleUrl: './skills-shell.component.scss'
})
export class SkillsShellComponent {

}
