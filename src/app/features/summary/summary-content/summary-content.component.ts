import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { ApplicantService } from '../applicant.service';
import { ApplicantInfoComponent } from '../applicant-info/applicant-info.component';
import { Applicant } from '../applicant.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'at-summary-content',
  imports: [
    GridViewComponent,
    TableViewComponent,
    ApplicantInfoComponent,
    AsyncPipe,
  ],
  templateUrl: './summary-content.component.html',
  styleUrl: './summary-content.component.scss',
})
export class SummaryContentComponent {
  private apService = inject(ApplicantService);
  private destoryRef = inject(DestroyRef);

  selectedApplicant$ = this.apService.selectedApplicant$;
  applicants = this.apService.allApplicants;

  view = input.required<string>();
}
