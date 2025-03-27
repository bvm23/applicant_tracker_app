import { Component, input } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';

@Component({
  selector: 'at-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  user = input.required<Applicant>();
}
