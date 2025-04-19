import { Component, computed, inject, input, signal } from '@angular/core';
import { ApplicantService } from '../applicant.service';
import { Applicant } from '../applicant.model';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { FilterService } from '../../../shared/services/filter.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'at-table-view',
  imports: [HighlightDirective, DatePipe],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);

  view = input.required<string>();
  selectedValue = signal<{ key: string; userId: string } | undefined>(
    undefined
  );
  sortConfig = this.filterService.sortCriteria;

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

  applicants = computed(() => {
    const sortedList =
      this.sortConfig().key && this.sortConfig().order
        ? this.filterService.sort(this.apService.allApplicants())
        : this.apService.allApplicants();
    return this.filterService
      .filterBySearch(sortedList)
      .filter((ap) =>
        ap.role.includes(this.view() === 'engineering' ? 'engineering' : '')
      )
      .map((ap) => Object.entries(ap));
  });

  selectValue(key: string, userId: string) {
    this.selectedValue.set({ key, userId });
  }
}
