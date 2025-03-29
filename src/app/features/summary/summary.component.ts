import { Component, signal } from '@angular/core';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { type LucideIconData } from '../../core/constants/icons.constants';
import {
  SwitchActionButtonData,
  ModifierActionButtonData,
} from '../../core/constants/data.constants';
import { SearchX, LucideAngularModule } from 'lucide-angular';

import { SummaryContentComponent } from './summary-content/summary-content.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'at-summary',
  imports: [
    ActionButtonComponent,
    SummaryContentComponent,
    LucideAngularModule,
    FormsModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  switchButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = SwitchActionButtonData;

  modifierButtons: {
    icon: string;
    name: string;
    view: string;
  }[] = ModifierActionButtonData;

  selectedView = signal<string>('STAGE');
  searchOpen = signal<boolean>(false);
  searchText = signal<string>('');

  closeSearchIcon: LucideIconData = SearchX;

  toggleSearch() {
    this.searchOpen.set(!this.searchOpen());
    this.searchText.set('');
  }

  onClick(view: string) {
    this.selectedView.set(view);
  }
}
