import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Applicant } from '../applicant.model';
import {
  ChevronsRight,
  CircleX,
  ChevronUp,
  ChevronDown,
  LucideAngularModule,
} from 'lucide-angular';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { ApplicantService } from '../applicant.service';
import { DatePipe } from '@angular/common';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';
import { debounce } from '../../../shared/utils/utils';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'at-applicant-info',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    DatePipe,
    HighlightDirective,
    PopupMenuComponent,
    LucideAngularModule,
  ],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent {
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

  openedMenu = signal<string | undefined>('');
  openedMenuValues = signal<string[]>([]);
  applicant = signal<Applicant | undefined>(undefined);
  comments = signal<{ value: string; addedTime: string }[]>([]);

  entries = computed(() =>
    Object.entries(this.applicant() as object).filter(
      (pair) => !['id', 'name'].includes(pair[0])
    )
  );

  ngOnInit(): void {
    const subscription = this.apService.selectedApplicant$.subscribe({
      next: (value) => this.applicant.set(value),
    });

    this.newNameInputComponent()?.nativeElement.focus();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
    let modifiedValue: string | string[] =
      selectedKey === 'skills'
        ? Array.from(new Set([...this.applicant()!.skills, newValue]))
        : newValue;

    let newData = { [selectedKey]: modifiedValue };

    this.apService.updateApplicant(this.applicant()!.id, newData);
    this.applicant.update((previousData) =>
      Object.assign({}, previousData, newData)
    );
    if (!['email', 'website', 'skills'].includes(selectedKey)) {
      this.openedMenu.set(undefined);
      this.openedMenuValues.set([]);
    }
  }

  removeValue(e: Event, selectedKey: string, value: string) {
    let modifiedValue: string[] =
      this.applicant()?.skills.filter((val) => val !== value) || [];

    let newData = { [selectedKey]: modifiedValue };

    this.apService.updateApplicant(this.applicant()!.id, newData);
    this.applicant.update((previousData) =>
      Object.assign({}, previousData, newData)
    );
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
