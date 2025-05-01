import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'at-user-card',
  imports: [
    HighlightDirective,
    ActionButtonComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit {
  private el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  private apService = inject(ApplicantService);

  optionIcon: LucideIcon = Ellipsis;
  checkIcon: LucideIcon = Check;

  newForm = new FormGroup({
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

  formIsValid = signal<boolean>(true);

  ngOnInit(): void {
    const subscription = this.apService.selectedApplicant$.subscribe({
      next: (value) => {
        this.el.nativeElement.style.borderColor =
          value?.id === this.user().id ? '#22648d' : '';
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /*
   *changing bordercolor of user-card based on form validation.
   *formIsValid = no change
   *form is invalid, bordercolor changed to red
   */
  formEffect = effect(() => {
    const valid = this.formIsValid();
    this.el.nativeElement.style.borderColor = !valid ? '#792223' : '';
    this.el.nativeElement.style.backgroundColor = !valid
      ? 'rgb(121, 34, 35, 0.2)'
      : '';
  });

  toggleMenu(e: MouseEvent) {
    this.focusChange.emit({
      id: this.user().id,
      x: e.x,
      y: e.y,
    });
  }

  onSelectUser(e: Event) {
    if (e.target === this.el.nativeElement) {
      this.apService.selectApplicant(this.user().id);
    }
  }

  onSubmit() {
    const valid = this.newForm.valid;
    this.formIsValid.set(valid);
    if (!valid) {
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
      skills: formData.skills?.split(',').map((s) => s.trim().toLowerCase())!,
    };

    this.apService.addApplicant(newApplicantData);
    this.newForm.reset();
    this.added.emit();
  }
}
