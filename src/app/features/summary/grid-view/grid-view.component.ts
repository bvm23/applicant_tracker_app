import { Component, computed, inject, signal } from '@angular/core';
import { Stages } from '../../../core/constants/data.constants';
import { ApplicantService } from '../applicant.service';
import { Applicant } from '../applicant.model';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'at-grid-view',
  imports: [UserCardComponent, HighlightDirective, PopupMenuComponent],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);

  applicants = this.apService.allApplicants;
  stages = Stages;

  focused = signal<{ id: string; x: number; y: number } | undefined>(undefined);

  selectedUser = computed(() =>
    this.applicants().find((appl) => appl.id === this.focused()?.id)
  );

  generateApplicantListByStage() {
    let applicantsList = this.filterService.filteredBySearch();

    return this.stages.map((stage) => {
      let stageData: {
        name: string;
        value: string;
        people: Applicant[];
        peopleCount: number;
      } = {
        name: stage.name,
        value: stage.value,
        people: [],
        peopleCount: 0,
      };
      let filteredApplicants = applicantsList.filter(
        (ap) => ap.stage === stage.value
      );
      stageData.people = filteredApplicants;
      stageData.peopleCount = filteredApplicants.length;
      return stageData;
    });
  }

  applicantByStages = computed(() => this.generateApplicantListByStage());

  clearFocus() {
    this.focused.set(undefined);
  }
}
