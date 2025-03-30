import { Component, computed, inject, input, signal } from '@angular/core';
import { Stages } from '../../../core/constants/data.constants';
import { ApplicantService } from '../applicant.service';
import { Applicant } from '../applicant.model';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';

@Component({
  selector: 'at-grid-view',
  imports: [UserCardComponent, HighlightDirective, PopupMenuComponent],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  private apService = inject(ApplicantService);

  applicants = this.apService.allApplicants;
  stages = Stages;

  focused = signal<{ id: string; x: number; y: number } | undefined>(undefined);

  selectedUser = computed(() =>
    this.applicants().find((appl) => appl.id === this.focused()?.id)
  );

  applicantByStages = computed(() =>
    this.stages.map((stage) => {
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
      let filteredApplicants = this.applicants().filter(
        (ap) => ap.stage === stage.value
      );
      stageData.people = filteredApplicants;
      stageData.peopleCount = filteredApplicants.length;
      return stageData;
    })
  );

  clearFocus() {
    this.focused.set(undefined);
  }
}
