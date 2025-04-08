import { Component, inject, signal } from '@angular/core';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { type LucideIcon } from '../../core/constants/icons.constants';
import {
  SwitchActionButtonData,
  ModifierActionButtonData,
} from '../../core/constants/data.constants';
import { SearchX, LucideAngularModule } from 'lucide-angular';

import { SummaryContentComponent } from './summary-content/summary-content.component';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../shared/services/filter.service';
import { debounce } from '../../shared/utils/utils';
import { FilterTabComponent } from './filter-tab/filter-tab.component';

@Component({
  selector: 'at-summary',
  imports: [
    ActionButtonComponent,
    SummaryContentComponent,
    LucideAngularModule,
    FormsModule,
    FilterTabComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  private filterService = inject(FilterService);
  searchText = signal<string>('');
  selectedView = signal<string>('STAGE');
  searchOpen = signal<boolean>(false);
  sortOpen = signal<boolean>(true);

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

  closeSearchIcon: LucideIcon = SearchX;

  toggleSearch() {
    this.searchOpen.set(!this.searchOpen());
  }

  toggleFilterTab() {
    this.sortOpen.set(!this.sortOpen());
  }

  onSearchTextChange() {
    this.filterService.addCriteria('search', this.searchText().trim());
  }

  debouncedTextChange = debounce(this.onSearchTextChange.bind(this), 500);

  onClick(view: string) {
    this.selectedView.set(view);
  }
}
