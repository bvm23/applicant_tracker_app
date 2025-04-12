import { Component, computed, inject, signal } from '@angular/core';
import { Stages } from '../../../core/constants/data.constants';
import { ApplicantService } from '../applicant.service';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { FilterService } from '../../../shared/services/filter.service';
import { CardMenuComponent } from '../../../shared/components/popup-menu/card-menu/card-menu.component';

@Component({
  selector: 'at-grid-view',
  imports: [UserCardComponent, HighlightDirective, CardMenuComponent],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  focused = signal<{ id: string; x: number; y: number } | undefined>(undefined);
  focusedUser = computed(() =>
    this.applicants().find((appl) => appl.id === this.focused()?.id)
  );

  applicants = this.apService.allApplicants;
  sortConfig = this.filterService.sortCriteria;

  stages = Stages;

  applicantByStages = computed(() => {
    if (this.sortConfig().key && this.sortConfig().order) {
      const sortedList = this.filterService.sort(this.applicants());
      return this.apService.getApplicantsByStage(
        this.filterService.filterBySearch(sortedList)
      );
    }
    return this.apService.getApplicantsByStage(
      this.filterService.filterBySearch(this.applicants())
    );
  });

  clearFocus() {
    this.focused.set(undefined);
  }
}
