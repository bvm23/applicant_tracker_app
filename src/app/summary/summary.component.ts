import { Component, signal } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { icons } from '../../assets/icon/icons';
import {
  switchActionButtonData,
  modifierActionButtonData,
} from '../../assets/data/data';

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
