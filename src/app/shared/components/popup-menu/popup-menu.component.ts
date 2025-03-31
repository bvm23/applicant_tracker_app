import { Component, computed, inject, input, output } from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';
import { ActionButtonComponent } from '../action-button/action-button.component';
import {
  Copy,
  Link,
  CornerUpRight,
  Trash2,
  GripVertical,
  LucideAngularModule,
} from 'lucide-angular';
import { ApplicantService } from '../../../features/summary/applicant.service';
import { Stages } from '../../../core/constants/data.constants';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'at-popup-menu',
  imports: [ActionButtonComponent, HighlightDirective, LucideAngularModule],
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.scss',
})
export class PopupMenuComponent {
  private apService = inject(ApplicantService);
  user = input.required<Applicant>();
  close = output<void>();
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
    this.apService.addApplicant(this.user(), true);
    this.closeMenu();
  }

  onMove(newStage: string) {
    console.log('onmove' + newStage);
    this.apService.updateApplicant(this.user().id, { stage: newStage });
    this.closeMenu();
  }

  onDelete() {
    this.apService.deletApplicant(this.user().id);
    this.closeMenu();
  }
}
