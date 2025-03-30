import { Component, input } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';

@Component({
  selector: 'at-popup-menu',
  imports: [],
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.scss',
})
export class PopupMenuComponent {
  user = input.required<Applicant>();
}
