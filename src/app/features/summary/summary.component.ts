import { Component, signal } from '@angular/core';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { icons } from '../../core/constants/icons.constants';
import {
  switchActionButtonData,
  modifierActionButtonData,
} from '../../core/constants/data.constants';

@Component({
  selector: 'at-summary',
  imports: [ActionButtonComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  switchButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = switchActionButtonData;

  modifierButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = modifierActionButtonData;

  selectedView = signal<string>('STAGE');

  onClick(view: string) {
    this.selectedView.set(view);
  }
}
