import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HighlightDirective } from '../../directives/highlight.directive';
import { type Applicant } from '../../../features/summary/applicant.model';
import { CircleX, LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ApplicantService } from '../../../features/summary/applicant.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'at-edit-modal',
  imports: [HighlightDirective, LucideAngularModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss',
})
export class EditModalComponent {
  private apService = inject(ApplicantService);
  private dbService = inject(DbService);

  innerInputComponent = viewChild<ElementRef<HTMLInputElement>>('innerInput');

  closeBtnIcon2 = CircleX;

  key = input.required<string>();
  applicant = input.required<Applicant>();
  edited = output();
  customValue = signal<string>('');

  suggestedValues = computed(() => {
    const key = this.key() as Partial<keyof Applicant>;
    let values = this.generateValues(key);
    return values;
  });

  // focusing on input component inside the editing div when selecting for editing.
  focusChangeEffect = effect(() => {
    if (this.key()) {
      this.innerInputComponent()?.nativeElement.focus();
    }
  });

  generateValues(key: keyof Applicant) {
    let values: string[] = [];
    const applicants = this.apService.allApplicants();
    if (key === 'skills') {
      for (const ap of applicants) {
        for (const skill of ap[key]) {
          values.push(skill);
        }
      }
    } else {
      for (const ap of applicants) {
        values.push(ap[key]);
      }
    }
    const valuesWithoutDuplicates = Array.from(new Set(values)).filter(
      (val) => val !== this.applicant()![key]
    );
    return valuesWithoutDuplicates;
  }

  getValue(_key: string) {
    let key = _key as Partial<keyof Applicant>;
    return this.applicant()![key] as string;
  }

  inputChange(e: Event, key: string) {
    const input = e.target as HTMLInputElement;
    let _key = key as keyof Applicant;
    if (input.value.trim() === this.applicant()[_key]) return;
    this.updateValue(input.value.trim());
  }

  updateValue(newData: string | string[]) {
    const applicantId = this.applicant().id;
    this.dbService.update(applicantId, { [this.key()]: newData }).subscribe({
      complete: () =>
        this.apService.updateApplicant(applicantId, { [this.key()]: newData }),
    });
  }

  removeValue(value: string) {
    let newValue: string | string[] = '';
    if (typeof this.getValue(this.key()) === 'object') {
      let currentValue = this.getValue(this.key());
      newValue = [...currentValue].filter((val) => val !== value);
    }
    this.updateValue(newValue);
  }

  selectValue(value?: string) {
    const key = this.key();
    let selectedValue = value ? value : this.customValue();
    selectedValue = selectedValue.toLowerCase();
    let newData: string | string[] = [];
    if (typeof this.getValue(key) === 'object') {
      newData = [...this.getValue(key), selectedValue] as string[];
      newData = Array.from(new Set(newData));
    } else {
      newData = selectedValue;
    }

    this.updateValue(newData);
    this.closeEdit();
  }

  closeEdit() {
    this.customValue.set('');
    this.edited.emit();
  }
}
