import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
  private destroyRef = inject(DestroyRef);

  closeBtnIcon = ChevronsRight;

  openedMenu = signal<string | undefined>('');
  openedMenuValues = signal<string[]>([]);
  applicant = signal<Applicant | undefined>(undefined);
  defaultMenuValues: object[] = [];
  entries = computed(() =>
    Object.entries(this.applicant() as object).filter(
      (pair) => !['id', 'name'].includes(pair[0])
    )
  );

  ngOnInit(): void {
    const subscription = this.apService.selectedApplicant$.subscribe({
      next: (value) => this.applicant.set(value),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onClose() {
    this.apService.removeSelectedApplicant();
  }

  toggleValueMenu(key: string) {
    if (['added', 'attachments', 'website', 'email'].includes(key)) return;

    this.openedMenu.set(this.openedMenu() === key ? undefined : key);

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
    let modifiedValue: string | string[];
    if (selectedKey === 'skills') {
      modifiedValue = Array.from(
        new Set([...this.applicant()!.skills, newValue])
      );
    } else {
      modifiedValue = newValue;
    }
    let newData = { [selectedKey]: modifiedValue };

    this.apService.updateApplicant(this.applicant()!.id, newData);
    this.applicant.update((previousData) =>
      Object.assign({}, previousData, newData)
    );
    this.openedMenu.set(undefined);
    this.openedMenuValues.set([]);
  }
}
