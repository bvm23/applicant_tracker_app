import { Component, computed, inject } from '@angular/core';
import { Stages } from '../../../core/constants/data.constants';
import { ApplicantService } from '../applicant.service';
import { Applicant } from '../applicant.model';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'at-grid-view',
  imports: [UserCardComponent, HighlightDirective],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
  private apService = inject(ApplicantService);

  applicants = this.apService.allApplicants;
  stages = Stages;
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
}
