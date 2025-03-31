import { Component, inject, input } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { Copy, Link, CornerUpRight, Trash2 } from 'lucide-angular';
import { ApplicantService } from '../../../features/summary/applicant.service';

@Component({
  selector: 'at-popup-menu',
  imports: [ActionButtonComponent],
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.scss',
})
export class PopupMenuComponent {
  private apService = inject(ApplicantService);
  user = input.required<Applicant>();
  linkIcon = Link;
  duplicateIcon = Copy;
  moveIcon = CornerUpRight;
  deleteIcon = Trash2;

  onDuplicate() {
    console.log('duplicate');
    this.apService.addApplicant(this.user(), true);
  }
}
