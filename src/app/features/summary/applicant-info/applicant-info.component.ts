import { Component, computed, inject, input, signal } from '@angular/core';
import { Applicant } from '../applicant.model';
import { ChevronsRight, LucideAngularModule } from 'lucide-angular';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { ApplicantService } from '../applicant.service';
import { DatePipe } from '@angular/common';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';

@Component({
  selector: 'at-applicant-info',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    DatePipe,
    HighlightDirective,
    PopupMenuComponent,
  ],
  templateUrl: './applicant-info.component.html',
  styleUrl: './applicant-info.component.scss',
})
export class ApplicantInfoComponent {
  private apService = inject(ApplicantService);

  closeBtnIcon = ChevronsRight;

  openedMenu = signal<string | undefined>('');
  openedMenuValues = signal<string[]>([]);
  applicant = input<Applicant | undefined>(undefined);
  entries = computed(() =>
    Object.entries(this.applicant() as object).filter(
      (pair) => !['id', 'name'].includes(pair[0])
    )
  );

  onClose() {
    this.apService.removeSelectedApplicant();
  }

  toggleValueMenu(key: string) {
    this.openedMenu.set(key);

    let allValues: string[] = [];
    this.apService.allApplicants().map((ap) => {
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
}
