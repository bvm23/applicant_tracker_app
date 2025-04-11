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

  sortCriteria = this.filterService.sortCriteria;

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

  get sortIsActive() {
    return this.sortOpen() && this.sortCriteria().key;
  }

  toggleSearch() {
    this.searchOpen.set(!this.searchOpen());
  }

  toggleSortTab() {
    if (!this.sortCriteria().key) {
      this.filterService.addSortCriteria({ key: 'added', order: 'desc' });
    }
    this.sortOpen.set(!this.sortOpen());
  }

  onSearchTextChange() {
    this.filterService.addCriteria('search', this.searchText().trim());
  }

  debouncedTextChange = debounce(this.onSearchTextChange.bind(this), 500);

  onClick(view: string) {
    this.selectedView.set(view);
  }

  clearSort() {
    this.filterService.removeSortCriteria();
    this.sortOpen.set(false);
  }
}
