import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { Applicant } from '../../../features/summary/applicant.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { Ellipsis } from 'lucide-angular';
import { LucideIcon } from '../../../core/constants/icons.constants';
import { ApplicantService } from '../../../features/summary/applicant.service';
import { ApplicantPlaceholder } from '../../../core/constants/data.constants';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'at-user-card',
  imports: [HighlightDirective, ActionButtonComponent, ReactiveFormsModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  host: {
    '(click)': 'onSelectUser($event)',
  },
})
export class UserCardComponent implements OnInit {
  private el = inject<ElementRef<HTMLDivElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  private apService = inject(ApplicantService);

  optionIcon: LucideIcon = Ellipsis;

  newForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    hiringManager: new FormControl('', { validators: [Validators.required] }),
    location: new FormControl('', { validators: Validators.required }),
    role: new FormControl('', { validators: Validators.required }),
    skills: new FormControl(''),
  });

  new = input<boolean>(false);
  user = input<Applicant>(ApplicantPlaceholder);
  focus = input<{ id: string; x: number; y: number }>();
  focusChange = output<{ id: string; x: number; y: number }>();

  ngOnInit(): void {
    const previousColor = this.el.nativeElement.style.borderColor;
    const subscription = this.apService.selectedApplicant$.subscribe({
      next: (value) => {
        if (value?.id === this.user().id) {
          this.el.nativeElement.style.borderColor = '#22648d';
        } else {
          this.el.nativeElement.style.borderColor = previousColor;
        }
      },
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

  onSelectUser(e: Event) {
    if (e.target === this.el.nativeElement) {
      this.apService.selectApplicant(this.user().id);
    }
  }

  onSubmit() {
    console.log('form submited');
  }
}
