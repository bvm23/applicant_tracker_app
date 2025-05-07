import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
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
import { Applicant } from '../applicant.model';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { DbService } from '../../../shared/services/db.service';

@Component({
  selector: 'at-table-view',
  imports: [
    HighlightDirective,
    DatePipe,
    LucideAngularModule,
    PopupMenuComponent,
    FormsModule,
    ActionButtonComponent,
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  private dbService = inject(DbService);

  private newValueInputComponent = viewChild<ElementRef<HTMLInputElement>>(
    'newValueInputComponent'
  );

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
  newValueInput = signal<string>('');

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

  suggestedValues = computed(() => {
    const key = this.selectedValue()?.key as keyof Applicant;
    const value = this.selectedValue()?.value;
    const applicants = this.apService.allApplicants();
    let values = this.generateValues(key, value, applicants);
    return values;
  });

  generateValues(
    key: keyof Applicant,
    value: string | undefined,
    applicants: Applicant[]
  ) {
    let values: string[] = [];
    if (key === 'skills') {
      let allValues: string[] = [];
      applicants.map((ap) => {
        ap[key].map((s) => allValues.push(s));
      });
      values = Array.from(new Set(allValues));
    } else {
      values = Array.from(new Set(applicants.map((ap) => ap[key])));
    }
    let sortedValues = values.sort((a, b) =>
      value?.includes(a) && !value.includes(b) ? -1 : 1
    );
    return sortedValues;
  }

  isEditableAndEditing(k: string, v: string, id: string) {
    const key = this.selectedValue()?.key;
    const value = this.selectedValue()?.value;
    const userId = this.selectedValue()?.userId;

    const editable = !!!['added', 'attachments'].includes(k);
    return k === key && v === value && id === userId && editable;
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

    this.newValueInput.set(
      ['name', 'email', 'website'].includes(key) && !isSelected ? value : ''
    );

    setTimeout(() => {
      this.newValueInputComponent()?.nativeElement.focus();
    });
  }

  onChangeValue(
    key: string,
    newValue: string,
    userId: string,
    action?: 'add' | 'remove'
  ) {
    let modifiedNewValue: string | string[] =
      action === 'remove' ? '' : newValue;
    if (key === 'skills') {
      const applicant = this.apService.getApplicantById(userId);
      let newSkills =
        action === 'remove'
          ? applicant?.skills.filter((s) => s !== newValue) || []
          : [...(applicant?.skills || []), newValue];
      modifiedNewValue = newSkills;
    }
    let newData = { [key]: modifiedNewValue };
    this.dbService.update(userId, newData).subscribe({
      complete: () => this.apService.updateApplicant(userId, newData),
    });
  }
}
