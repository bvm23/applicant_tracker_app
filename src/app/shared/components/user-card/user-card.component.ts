import { Component, ElementRef, inject, input, output } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { Ellipsis } from 'lucide-angular';
import { LucideIcon } from '../../../core/constants/icons.constants';

@Component({
  selector: 'at-user-card',
  imports: [HighlightDirective, ActionButtonComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  private el = inject(ElementRef) as ElementRef<HTMLDivElement>;
  user = input.required<Applicant>();

  focus = input<{ id: string; x: number; y: number }>();
  focusChange = output<{ id: string; x: number; y: number }>();

  optionIcon: LucideIcon = Ellipsis;

  toggleMenu(e: MouseEvent) {
    this.focusChange.emit({
      id: this.user().id,
      x: e.x,
      y: e.y,
    });
  }
}
