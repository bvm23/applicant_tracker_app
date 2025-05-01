import {
  Component,
  computed,
  DestroyRef,
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
import { debounce } from '../../../shared/utils/utils';
import { FilterService } from '../../../shared/services/filter.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, OperatorFunction } from 'rxjs';

@Component({
  selector: 'at-applicant-info',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent implements OnInit {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  private destroyRef = inject(DestroyRef);

  newNameInputComponent =
    viewChild<ElementRef<HTMLInputElement>>('newNameInput');
  newInfoInputComponent =
    viewChild<ElementRef<HTMLInputElement>>('newInfoInput');
  newCommentInputComponent =
    viewChild<ElementRef<HTMLInputElement>>('newCommentInput');

  closeBtnIcon = ChevronsRight;
  closeBtnIcon2 = CircleX;
  upArrow = ChevronUp;
  downArrow = ChevronDown;
  sideScreenIcon = PanelRight;
  fullscreenIcon = Fullscreen;

  form = new FormGroup({
    name: new FormControl(''),
    role: new FormControl(''),
    email: new FormControl(''),
    employment: new FormControl(''),
    location: new FormControl(''),
    source: new FormControl(''),
    stage: new FormControl(''),
    website: new FormControl(''),
    attachments: new FormControl(''),
    hiringManager: new FormControl(''),
    added: new FormControl(''),
  });

  uid = input<string>();
  openedMenu = signal<string | undefined>('');
  openedMenuValues = signal<string[]>([]);
  comments = signal<{ value: string; addedTime: string }[]>([]);
  selectedPeek = signal<'side' | 'center'>('side');

  constructor() {
    effect(() => {
      this.form.setValue({
        name: this.applicant()?.name || '',
        role: this.applicant()?.role || '',
        email: this.applicant()?.email || '',
        employment: this.applicant()?.employment || '',
        location: this.applicant()?.location || '',
        source: this.applicant()?.source || '',
        stage: this.applicant()?.stage || '',
        website: this.applicant()?.website || '',
        attachments: this.applicant()?.attachments || '',
        hiringManager: this.applicant()?.hiringManager || '',
        added: this.applicant()?.added || '',
      });
    });
  }

  ngOnInit(): void {
    const formSubscription = this.form.valueChanges
      .pipe(debounceTime(500), this.detectInputValueOnly())
      .subscribe({
        next: (value) => console.log(value),
      });

    this.newNameInputComponent()?.nativeElement.focus();

    this.destroyRef.onDestroy(() => formSubscription.unsubscribe());
  }

  detectInputValueOnly(): OperatorFunction<unknown, Partial<Applicant>> {
    return map((ap) => {
      let applicant = this.applicant() as Applicant;
      let inputApplicant = ap as Partial<Applicant>;
      const keys = Object.keys(inputApplicant);
      let changedValues = {};
      keys.map((k) => {
        let key = k as keyof Partial<Applicant>;
        if (inputApplicant[key] !== applicant[key]) {
          Object.assign(changedValues, { [key]: inputApplicant[key] });
        }
      });
      return changedValues;
    });
  }

  applicant = computed(() => this.apService.getApplicantById(this.uid() || ''));

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

  switchView(view: 'side' | 'center') {
    this.selectedPeek.set(view);
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
  }

  isEditingValue(key: string) {
    return this.openedMenu() === key;
  }

  onClose() {
    this.apService.removeSelectedApplicant();
  }

  toggleValueMenu(e: Event, key: string) {
    let requiredTarget = e.target as HTMLDivElement;
    if (requiredTarget.tagName !== 'DIV') {
      return;
    }

    if (['added', 'attachments'].includes(key)) return;
    this.openedMenu.set(this.openedMenu() === key ? undefined : key);

    if (key === 'email' || key === 'website') {
      setTimeout(() => {
        this.newInfoInputComponent()?.nativeElement.focus();
      });
      return;
    }

    let allValues: string[] = [];
    this.apService
      .allApplicants()
      .filter((ap) => ap.id !== this.applicant()?.id)
      .map((ap) => {
        let _key = key as keyof Applicant;
        let value = ap[_key];
        if (typeof value === 'object') {
          allValues.push(...value);
        } else {
          allValues.push(value);
        }
      });
    this.openedMenuValues.set(Array.from(new Set(allValues)));
  }

  updateValue(selectedKey: string, newValue: string) {
    // let modifiedValue: string | string[] =
    //   selectedKey === 'skills'
    //     ? Array.from(new Set([...this.applicant()!.skills, newValue]))
    //     : newValue;
    // let newData = { [selectedKey]: modifiedValue };
    // this.apService.updateApplicant(this.applicant()!.id, newData);
    // this.applicant.update((previousData) =>
    //   Object.assign({}, previousData, newData)
    // );
    // if (!['email', 'website', 'skills'].includes(selectedKey)) {
    //   this.openedMenu.set(undefined);
    //   this.openedMenuValues.set([]);
    // }
  }

  removeValue(e: Event, selectedKey: string, value: string) {
    // let modifiedValue: string[] =
    //   this.applicant()?.skills.filter((val) => val !== value) || [];
    // let newData = { [selectedKey]: modifiedValue };
    // this.apService.updateApplicant(this.applicant()!.id, newData);
    // this.applicant.update((previousData) =>
    //   Object.assign({}, previousData, newData)
    // );
  }

  debouncedUpdateValue = debounce(this.updateValue.bind(this), 500);

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
