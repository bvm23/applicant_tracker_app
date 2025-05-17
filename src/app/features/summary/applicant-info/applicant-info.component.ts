import {
  Component,
  computed,
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
  SendHorizontal,
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
import { DbService } from '../../../shared/services/db.service';
import { EditModalComponent } from '../../../shared/components/edit-modal/edit-modal.component';

@Component({
  selector: 'at-applicant-info',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    LucideAngularModule,
    HighlightDirective,
    FormsModule,
    DatePipe,
    EditModalComponent,
  ],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent implements OnInit {
  private apService = inject(ApplicantService);
  private filterService = inject(FilterService);
  private dbService = inject(DbService);
  private router = inject(Router);

  inputComponent = viewChild<ElementRef<HTMLInputElement>>('inputComponent');
  newCommentInputComponent =
    viewChild<ElementRef<HTMLInputElement>>('newCommentInput');

  closeBtnIcon = ChevronsRight;
  closeBtnIcon2 = CircleX;
  upArrow = ChevronUp;
  downArrow = ChevronDown;
  sideScreenIcon = PanelRight;
  fullscreenIcon = Fullscreen;
  sendIcon = SendHorizontal;
  readonly Keys = Keys.filter((k) => k !== 'name');

  uid = input<string>();
  selectedPeek = signal<'side' | 'center'>('side');
  editingInput = signal<string>('');
  customValue = signal<string>('');
  applicant = input<Applicant>();
  commentText = '';

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

  userComments = computed(() =>
    this.apService.allComments().filter((c) => c.uid === this.uid())
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
    if (input.value.trim() === this.applicant()?.name) return;
    this.updateValue(key, input.value.trim());
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

  updateValue(key: string, newData: string | string[]) {
    this.dbService.update(this.uid()!, { [key]: newData }).subscribe({
      complete: () =>
        this.apService.updateApplicant(this.uid()!, { [key]: newData }),
    });
  }

  addComment() {
    if (!this.commentText) return;
    const commentData = { text: this.commentText, uid: this.uid()! };
    this.dbService.addComment(commentData);
    this.commentText = '';
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
