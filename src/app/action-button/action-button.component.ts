import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'button[at-action-button]',
  imports: [LucideAngularModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  icon = input.required<any>();
  color = input<string>();
  size = input<number>(14);
}
