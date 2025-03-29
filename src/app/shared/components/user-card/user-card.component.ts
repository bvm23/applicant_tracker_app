import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { Ellipsis } from 'lucide-angular';
import { LucideIcon } from '../../../core/constants/icons.constants';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';

@Component({
  selector: 'at-user-card',
  imports: [HighlightDirective, ActionButtonComponent, PopupMenuComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  user = input.required<Applicant>();
  private el = inject(ElementRef) as ElementRef<HTMLDivElement>;
  optionIcon: LucideIcon = Ellipsis;

  menuOpened = signal<boolean>(false);

  toggleMenu(e: Event) {
    this.menuOpened.set(!this.menuOpened());
  }
}
