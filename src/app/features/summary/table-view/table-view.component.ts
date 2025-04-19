import { Component, computed, inject, input, signal } from '@angular/core';
import { ApplicantService } from '../applicant.service';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { FilterService } from '../../../shared/services/filter.service';
import { DatePipe } from '@angular/common';
import { ArrowDown, ArrowUp, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'at-table-view',
  imports: [HighlightDirective, DatePipe, LucideAngularModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);

  keys = [
    'id',
    'name',
    'role',
    'stage',
    'email',
    'hiringManager',
    'attachments',
    'website',
    'skills',
    'location',
    'employment',
    'source',
    'added',
  ];
  downArrowIcon = ArrowDown;
  upArrowIcon = ArrowUp;

  view = input.required<string>();
  selectedValue = signal<{ key: string; userId: string } | undefined>(
    undefined
  );
  sortConfig = this.filterService.sortCriteria;

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
    const isSelected =
      JSON.stringify(this.selectedValue()) === JSON.stringify({ key, userId });
    isSelected
      ? this.selectedValue.set(undefined)
      : this.selectedValue.set({ key, userId });
  }

  onSelectKey(key: string) {
    this.filterService.addSortCriteria({
      key: key,
      order: this.sortConfig().order === 'desc' ? 'asc' : 'desc',
    });
  }
}
