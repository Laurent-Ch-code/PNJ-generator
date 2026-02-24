import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-panel.component.html',
  styleUrl: './collapsible-panel.component.scss'
})
export class CollapsiblePanelComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() count?: number;
  @Input() isCollapsed: boolean = true;
  @Output() toggleCollapse = new EventEmitter<void>();

  onToggle(): void {
    this.toggleCollapse.emit();
  }
}
