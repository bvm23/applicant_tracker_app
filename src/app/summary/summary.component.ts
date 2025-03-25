import { Component } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { icons } from '../../assets/icon/icons';

@Component({
  selector: 'at-summary',
  imports: [ActionButtonComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  readonly tableIcon = icons['TABLE'];
  readonly groupIcon = icons['GROUP'];
  readonly searchIcon = icons['SEARCH'];
  readonly sortIcon = icons['SORT'];
  readonly filterIcon = icons['FILTER'];
}
