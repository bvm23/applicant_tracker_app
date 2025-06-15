import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  type Applicant,
  type InputApplicantData,
} from '../../../features/summary/applicant.model';
import { type FormControls } from './user-card.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { Check, Ellipsis } from 'lucide-angular';
import { LucideIcon } from '../../../core/constants/icons.constants';
import { ApplicantService } from '../../../features/summary/applicant.service';
import { ApplicantPlaceholder } from '../../../core/constants/data.constants';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'at-user-card',
  imports: [HighlightDirective, ActionButtonComponent, ReactiveFormsModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit {
  private apService = inject(ApplicantService);
  private dbService = inject(DbService);
  private loader = inject(LoadingBarService).useRef();
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  optionIcon: LucideIcon = Ellipsis;
  checkIcon: LucideIcon = Check;

  newForm = new FormGroup<FormControls>({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    location: new FormControl('', { validators: Validators.required }),
    role: new FormControl('', { validators: Validators.required }),
    hiringManager: new FormControl('', { validators: [Validators.required] }),
    skills: new FormControl('', { validators: Validators.required }),
  });

  createInStage = input<string>('', { alias: 'createIn' });
  user = input<Applicant>(ApplicantPlaceholder);
  focus = input<{ id: string; x: number; y: number }>();
  focusChange = output<{ id: string; x: number; y: number }>();
  added = output();

  selected = signal<string | undefined>(undefined);
  formIsInvalid = signal<boolean>(false);

  ngOnInit(): void {
    const subscription = this.apService.selectedApplicantId$.subscribe({
      next: (value) => this.selected.set(value),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  toggleMenu(e: MouseEvent) {
    this.focusChange.emit({
      id: this.user().id,
      x: e.x,
      y: e.y,
    });
  }

  openInfo(e: Event) {
    const el = e.target as Element;
    if (el.tagName !== 'DIV') return;
    this.apService.selectApplicant(this.user().id);
    this.router.navigate(['info', this.user().id]);
  }

  onSubmit() {
    const invalid = this.newForm.invalid;
    this.formIsInvalid.set(invalid);

    if (invalid) {
      return;
    }

    const formData = this.newForm.value;
    const newApplicantData: InputApplicantData = {
      name: formData.name!.trim().toLowerCase(),
      email: formData.email!.trim(),
      location: formData.location!.trim().toLowerCase(),
      role: formData.role!.trim().toLowerCase(),
      hiringManager: formData.hiringManager!.trim().toLowerCase(),
      stage: this.createInStage()!,
      skills: formData.skills
        ?.split(',')
        .filter((s) => s.trim())
        .map((s) => s.trim().toLowerCase())!,
      attachments: '',
      source: '',
      website: '',
      employment: 'looking',
    };

    this.loader.start();
    this.dbService.add(newApplicantData).subscribe({
      next: (createdId) => Object.assign(newApplicantData, { id: createdId }),
      complete: () => {
        this.apService.addApplicant(newApplicantData as Applicant),
          this.loader.stop();
      },
    });
    this.newForm.reset();
    this.added.emit();
  }

  fieldIsInvalid(field: string) {
    let _f = field as keyof FormControls;
    let control = this.newForm.controls[_f];
    return control.invalid && control.touched && control.dirty;
  }
}
