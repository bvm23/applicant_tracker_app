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

@Component({
  selector: 'at-summary-content',
  imports: [GridViewComponent, TableViewComponent, ApplicantInfoComponent],
  templateUrl: './summary-content.component.html',
  styleUrl: './summary-content.component.scss',
})
export class SummaryContentComponent implements OnInit {
  private apService = inject(ApplicantService);
  private destoryRef = inject(DestroyRef);

  applicants = this.apService.allApplicants;

  view = input.required<string>();
  selectedApplicant = signal<Applicant | undefined>(undefined);

  applicantIsSelected = computed(
    () =>
      this.selectedApplicant() &&
      this.applicants().findIndex(
        (ap) => ap.id === this.selectedApplicant()?.id
      ) !== -1
  );

  ngOnInit(): void {
    const subscription = this.apService.selectedApplicant$.subscribe({
      next: (value) => this.selectedApplicant.set(value),
    });

    this.destoryRef.onDestroy(() => subscription.unsubscribe());
  }
}
