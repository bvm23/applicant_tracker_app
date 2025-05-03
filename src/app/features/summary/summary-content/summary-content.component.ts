import { Component, inject, input } from '@angular/core';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { ApplicantService } from '../applicant.service';

@Component({
  selector: 'at-summary-content',
  imports: [GridViewComponent, TableViewComponent],
  templateUrl: './summary-content.component.html',
  styleUrl: './summary-content.component.scss',
})
export class SummaryContentComponent {
  private apService = inject(ApplicantService);

  applicants = this.apService.allApplicants;

  view = input.required<string>();
}
