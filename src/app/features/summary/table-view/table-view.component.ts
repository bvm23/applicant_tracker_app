import { Component, computed, inject, input, signal } from '@angular/core';
import { ApplicantService } from '../applicant.service';
import { Applicant } from '../applicant.model';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'at-table-view',
  imports: [HighlightDirective],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  private apService = inject(ApplicantService);

  view = input.required<string>();
  selectedValue = signal<{ key: string; userId: string } | undefined>(
    undefined
  );

  keys = [
    'id',
    'name',
    'role',
    'stage',
    'email',
    'hiring manager',
    'attachments',
    'website',
    'skills',
    'location',
    'employment',
    'source',
    'added',
  ];

  applicants = computed(() =>
    this.apService
      .allApplicants()
      .filter((ap) =>
        ap.role.includes(this.view() === 'engineering' ? 'engineering' : '')
      )
      .map((ap) => Object.entries(ap))
  );

  selectValue(key: string, userId: string) {
    this.selectedValue.set({ key, userId });
  }
}
