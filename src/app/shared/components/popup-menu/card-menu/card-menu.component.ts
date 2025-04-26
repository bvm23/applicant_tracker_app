import { Component, computed, inject, input, output } from '@angular/core';
import { PopupMenuComponent } from '../popup-menu.component';
import { ApplicantService } from '../../../../features/summary/applicant.service';
import { Applicant } from '../../../../features/summary/applicant.model';
import { Stages } from '../../../../core/constants/data.constants';
import {
  Copy,
  Link,
  CornerUpRight,
  Trash2,
  GripVertical,
  LucideAngularModule,
} from 'lucide-angular';
import { ActionButtonComponent } from '../../action-button/action-button.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'at-card-menu',
  imports: [
    PopupMenuComponent,
    ActionButtonComponent,
    LucideAngularModule,
    HighlightDirective,
  ],
  templateUrl: './card-menu.component.html',
  styleUrl: './card-menu.component.scss',
})
export class CardMenuComponent {
  private apService = inject(ApplicantService);
  user = input.required<Applicant>();
  close = output();
  stages = computed(() => Stages.filter((s) => s.value !== this.user().stage));

  isSubsectionOpen = false;
  linkIcon = Link;
  duplicateIcon = Copy;
  moveIcon = CornerUpRight;
  deleteIcon = Trash2;
  dragIcon = GripVertical;

  toggleSubsection() {
    this.isSubsectionOpen = true;
  }

  closeMenu() {
    this.close.emit();
  }

  onDuplicate() {
    this.apService.duplicateApplicant(this.user().id);
    this.closeMenu();
  }

  onMove(newStage: string) {
    this.apService.updateApplicant(this.user().id, { stage: newStage });
    this.closeMenu();
  }

  onDelete() {
    this.apService.deletApplicant(this.user().id);
    this.closeMenu();
  }
}
