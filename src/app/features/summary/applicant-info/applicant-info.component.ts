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

  changeApplicant(action: string) {
    const selectedApplicant = this.applicant()!;
    const applicantsInSameStage = this.apService
      .allApplicants()
      .filter((ap) => ap.stage === selectedApplicant.stage);
    const sortedIds = this.filterService
      .sort(applicantsInSameStage)
      .map((ap) => ap.id);

    const firstIndex = 0;
    const lastIndex = sortedIds.length - 1;

    if (firstIndex === lastIndex) return;

    const selectedIndex = sortedIds.findIndex(
      (id) => id === selectedApplicant.id
    );
    let nextIndex: number =
      action === 'next' ? selectedIndex + 1 : selectedIndex - 1;

    if (action === 'next' && nextIndex >= sortedIds.length) {
      return;
    }
    if (action === 'prev' && nextIndex < 0) {
      return;
    }

    let nextApplicantId: string = sortedIds[nextIndex];
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
