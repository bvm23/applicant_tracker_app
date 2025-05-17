import { Component, computed, inject, input, signal } from '@angular/core';
import { ApplicantService } from '../applicant.service';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { FilterService } from '../../../shared/services/filter.service';
import { DatePipe } from '@angular/common';
import {
  ArrowDown,
  ArrowUp,
  Check,
  XCircle,
  LucideAngularModule,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { EditModalComponent } from '../../../shared/components/edit-modal/edit-modal.component';

@Component({
  selector: 'at-table-view',
  imports: [
    HighlightDirective,
    DatePipe,
    LucideAngularModule,
    FormsModule,
    EditModalComponent,
  ],
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
  submitIcon = Check;
  removeIcon = XCircle;

  sortConfig = this.filterService.sortCriteria;
  view = input.required<string>();
  selectedValue = signal<
    { key: string; value: string; userId: string } | undefined
  >(undefined);

  selectedApplicant = computed(() =>
    this.apService.getApplicantById(this.selectedValue()?.userId!)
  );

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
      .map((ap) => {
        return Object.entries(ap).sort((a, b) => {
          let aKey = a[0];
          let bKey = b[0];
          let indexOfAKey = this.keys.findIndex((val) => val === aKey);
          let indexOfBKey = this.keys.findIndex((val) => val === bKey);
          if (indexOfBKey < indexOfAKey) {
            return 1;
          } else if (indexOfBKey > indexOfAKey) {
            return -1;
          } else {
            return 0;
          }
        });
      });
  });

  isEditableAndEditing(k: string, v: string, id: string) {
    const key = this.selectedValue()?.key;
    const value = this.selectedValue()?.value;
    const userId = this.selectedValue()?.userId;

    const editable = !!!['added', 'attachments'].includes(k);
    return k === key && v === value && id === userId && editable;
  }

  clearSelection() {
    this.selectedValue.set(undefined);
  }

  onSelectKey(key: string) {
    this.filterService.addSortCriteria({
      key: key,
      order: this.sortConfig().order === 'desc' ? 'asc' : 'desc',
    });
  }

  onSelectValue(e: Event, key: string, value: string, userId: string) {
    const requiredTarget = e.target as Element;
    if (!['TD', 'P'].includes(requiredTarget.tagName)) return;

    const isSelected =
      JSON.stringify(this.selectedValue()) ===
      JSON.stringify({ key, value, userId });
    isSelected
      ? this.selectedValue.set(undefined)
      : this.selectedValue.set({ key, value, userId });
  }
}
