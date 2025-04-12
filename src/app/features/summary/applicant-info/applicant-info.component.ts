import { Component, computed, inject, input } from '@angular/core';
import { Applicant } from '../applicant.model';
import { ChevronsRight, LucideAngularModule } from 'lucide-angular';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { ApplicantService } from '../applicant.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'at-applicant-info',
  imports: [LucideAngularModule, ActionButtonComponent, DatePipe],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent {
  private apService = inject(ApplicantService);
  applicant = input<Applicant | undefined>(undefined);

  entries = computed(() =>
    Object.entries(this.applicant() as object).filter(
      (pair) => !['id', 'name'].includes(pair[0])
    )
  );

  closeBtnIcon = ChevronsRight;

  onClose() {
    this.apService.removeSelectedApplicant();
  }
}
