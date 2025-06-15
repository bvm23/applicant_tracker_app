import { Component, computed, inject, signal } from '@angular/core';
import { SampleData, Stages } from '../../../core/constants/data.constants';
import { ApplicantService } from '../applicant.service';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { FilterService } from '../../../shared/services/filter.service';
import { CardMenuComponent } from '../../../shared/components/popup-menu/card-menu/card-menu.component';
import { type Applicant } from '../applicant.model';
import { DbService } from '../../../shared/services/db.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'at-grid-view',
  imports: [UserCardComponent, HighlightDirective, CardMenuComponent],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  private dbService = inject(DbService);
  loader = inject(LoadingBarService).useRef();

  focused = signal<{ id: string; x: number; y: number } | undefined>(undefined);
  addingNewApplicantToStage = signal<string | undefined>(undefined);
  loaded = signal<boolean>(false);

  applicants = this.apService.allApplicants;
  sortConfig = this.filterService.sortCriteria;
  stages = Stages;

  ngOnInit() {
    this.loader.value$.subscribe({
      next: (val) => {
        if (val === 0) this.loaded.set(true);
      },
    });
  }

  focusedUser = computed(() =>
    this.applicants().find((appl) => appl.id === this.focused()?.id)
  );

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

  onAddNewCard() {
    this.addingNewApplicantToStage.set(undefined);
  }

  loadSampleData() {
    this.loader.start();
    for (const ap of SampleData) {
      this.dbService.add(ap).subscribe({
        next: (createdId) => Object.assign(ap, { id: createdId }),
        complete: () => {
          this.apService.addApplicant(ap as Applicant);
          this.loader.stop();
        },
      });
    }
  }
}
