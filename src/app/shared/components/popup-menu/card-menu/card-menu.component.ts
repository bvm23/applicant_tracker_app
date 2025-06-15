import { Component, computed, inject, input, output } from '@angular/core';
import { PopupMenuComponent } from '../popup-menu.component';
import { ApplicantService } from '../../../../features/summary/applicant.service';
import { type Applicant } from '../../../../features/summary/applicant.model';
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
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../../../services/db.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

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
  private dbService = inject(DbService);
  private loader = inject(LoadingBarService).useRef();
  private router = inject(Router);

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
    let { id, added, ...userData } = this.user();
    this.loader.start();
    this.dbService.add(userData).subscribe({
      next: (createdId) => Object.assign(userData, { id: createdId }),
      complete: () => {
        this.apService.addApplicant(userData as Applicant);
        this.loader.stop();
      },
    });
    this.closeMenu();
  }

  onMove(newStage: string) {
    const userId = this.user().id;
    this.loader.start();
    this.dbService.update(userId, { stage: newStage }).subscribe({
      complete: () => {
        this.apService.updateApplicant(userId, { stage: newStage });
        this.loader.stop();
      },
    });
    this.closeMenu();
  }

  onDelete() {
    const userId = this.user().id;
    this.loader.start();
    this.dbService.delete(userId).subscribe({
      complete: () => {
        this.apService.deleteApplicant(userId);
        this.loader.stop();
      },
    });
    this.closeMenu();
    this.router.navigate([''], {
      onSameUrlNavigation: 'reload',
    });
  }
}
