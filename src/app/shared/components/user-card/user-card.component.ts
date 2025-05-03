import { Component, inject, input, output, signal } from '@angular/core';
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
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'at-user-card',
  imports: [
    HighlightDirective,
    ActionButtonComponent,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
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

  toggleMenu(e: MouseEvent) {
    this.focusChange.emit({
      id: this.user().id,
      x: e.x,
      y: e.y,
    });
  }

  onSubmit() {
    const valid = this.newForm.valid;
    this.formIsValid.set(valid);
    console.log(valid);

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
