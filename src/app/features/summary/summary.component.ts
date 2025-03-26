import { Component, signal } from '@angular/core';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { icons } from '../../core/constants/icons.constants';
import {
  SwitchActionButtonData,
  ModifierActionButtonData,
} from '../../core/constants/data.constants';
import { SummaryContentComponent } from './summary-content/summary-content.component';

@Component({
  selector: 'at-summary',
  imports: [ActionButtonComponent, SummaryContentComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  switchButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = SwitchActionButtonData;

  modifierButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = ModifierActionButtonData;

  selectedView = signal<string>('STAGE');

  onClick(view: string) {
    this.selectedView.set(view);
  }
}
