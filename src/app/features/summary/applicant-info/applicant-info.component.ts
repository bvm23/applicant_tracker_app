import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { type Applicant } from '../applicant.model';
import {
  ChevronsRight,
  CircleX,
  ChevronUp,
  ChevronDown,
  Fullscreen,
  PanelRight,
  LucideAngularModule,
} from 'lucide-angular';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { ApplicantService } from '../applicant.service';
import { FilterService } from '../../../shared/services/filter.service';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { Keys } from '../../../core/constants/data.constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'at-applicant-info',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    LucideAngularModule,
    HighlightDirective,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent implements OnInit {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  private router = inject(Router);

  inputComponent = viewChild<ElementRef<HTMLInputElement>>('inputComponent');
  innerInputComponent = viewChild<ElementRef<HTMLInputElement>>('innerInput');
  newCommentInputComponent =
    viewChild<ElementRef<HTMLInputElement>>('newCommentInput');

  closeBtnIcon = ChevronsRight;
  closeBtnIcon2 = CircleX;
  upArrow = ChevronUp;
  downArrow = ChevronDown;
  sideScreenIcon = PanelRight;
  fullscreenIcon = Fullscreen;
  readonly Keys = Keys.filter((k) => k !== 'name');

  uid = input<string>();
  comments = signal<{ value: string; addedTime: string }[]>([]);
  selectedPeek = signal<'side' | 'center'>('side');
  editingInput = signal<string>('');
  customValue = signal<string>('');
  applicant = input<Applicant>();

  // focusing on input component inside the editing div when selecting for editing.
  focusChangeEffect = effect(() => {
    if (this.editingInput()) {
      this.innerInputComponent()?.nativeElement.focus();
    }
  });

  ngOnInit(): void {
    this.inputComponent()?.nativeElement.focus();
    this.apService.selectApplicant(this.uid()!);
  }

  applicantsInSameStage = computed(() =>
    this.filterService
      .sort(
        this.apService
          .allApplicants()
          .filter((ap) => ap.stage === this.applicant()?.stage)
      )
      .map((ap) => ap.id)
  );

  selectedApplicantIndex = computed(() =>
    this.applicantsInSameStage().findIndex(
      (apId) => apId === this.applicant()?.id
    )
  );

  suggestedValues = computed(() => {
    const key = this.editingInput() as Partial<keyof Applicant>;
    let values = this.generateValues(key);
    return values;
  });

  nextButtonIsDisabled = computed(
    () =>
      this.applicantsInSameStage().length <= 1 ||
      this.selectedApplicantIndex() === this.applicantsInSameStage().length - 1
  );

  prevButtonIsDisabled = computed(
    () =>
      this.applicantsInSameStage().length <= 1 ||
      this.selectedApplicantIndex() === 0
  );

  showSuggestedValuesAndEdit(e: Event, key: string) {
    const el = e.target as Element;
    if (el.tagName !== 'DIV') return;

    if (['added', 'attachments'].includes(key)) return;
    if (key === this.editingInput()) {
      this.editingInput.set('');
      return;
    }
    this.editingInput.set(key);
  }

  getValue(_key: string) {
    let key = _key as Partial<keyof Applicant>;
    return this.applicant()![key] as string;
  }

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

  closeEdit() {
    this.customValue.set('');
    this.editingInput.set('');
  }

  switchView(view: 'side' | 'center') {
    this.selectedPeek.set(view);
  }

  onClose() {
    this.apService.removeSelectedApplicant();
    this.router.navigate([''], { replaceUrl: true });
  }

  inputChange(e: Event, key: string) {
    const input = e.target as HTMLInputElement;
    this.updateValue(key, input.value);
  }

  changeApplicant(action: 'prev' | 'next') {
    const firstIndex = 0;
    const lastIndex = this.applicantsInSameStage().length - 1;
    if (firstIndex === lastIndex) return;

    const selectedIndex = this.selectedApplicantIndex();
    let nextIndex: number =
      action === 'next' ? selectedIndex + 1 : selectedIndex - 1;

    if (
      (action === 'next' && nextIndex > lastIndex) ||
      (action === 'prev' && nextIndex < firstIndex)
    ) {
      return;
    }

    let nextApplicantId: string = this.applicantsInSameStage()[nextIndex];
    this.apService.selectApplicant(nextApplicantId);
    this.router.navigate(['info', nextApplicantId]);
  }

  selectValue(key: string, value?: string) {
    let selectedValue = value ? value : this.customValue();
    selectedValue = selectedValue.toLowerCase();
    let newData: string | string[] = [];
    if (typeof this.getValue(key) === 'object') {
      newData = [...this.getValue(key), selectedValue] as string[];
      newData = Array.from(new Set(newData));
    } else {
      newData = selectedValue;
    }

    this.updateValue(key, newData);
    this.closeEdit();
  }

  updateValue(key: string, newData: string | string[]) {
    this.apService.updateApplicant(this.uid()!, { [key]: newData });
  }

  removeValue(key: string, value: string) {
    let newValue: string | string[] = '';
    if (typeof this.getValue(key) === 'object') {
      let currentValue = this.getValue(key);
      newValue = [...currentValue].filter((val) => val !== value);
    }
    this.updateValue(key, newValue);
  }

  addComment() {
    let comment = this.newCommentInputComponent()?.nativeElement.value!;
    let addedTime = new Date().toLocaleString();
    this.comments.update((previousComments) => [
      ...previousComments,
      { value: comment, addedTime },
    ]);
    this.newCommentInputComponent()!.nativeElement.value = '';
  }
}

/*
 *resolve function used for providing applicant data to all routes
 *and redirecting to homepage if the requested applicant is not found
 */
export const appplicantFound: ResolveFn<Applicant | undefined> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const apService = inject(ApplicantService);
  const router = inject(Router);
  const uid = activatedRoute.paramMap.get('uid');
  const fetchedApplicant = apService.getApplicantById(uid!);
  if (!fetchedApplicant) {
    router.navigate(['']);
  }
  return fetchedApplicant;
};
