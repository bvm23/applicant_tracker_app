import { Component, inject, output, signal } from '@angular/core';
import {
  ArrowDown,
  ArrowUp,
  LucideAngularModule,
  Trash2,
} from 'lucide-angular';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { PopupMenuComponent } from '../../../shared/components/popup-menu/popup-menu.component';
import { Keys } from '../../../core/constants/data.constants';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'at-filter-tab',
  imports: [LucideAngularModule, ActionButtonComponent, PopupMenuComponent],
  templateUrl: './filter-tab.component.html',
  styleUrl: './filter-tab.component.scss',
})
export class FilterTabComponent {
  private filterService = inject(FilterService);
  isSelectingOption = signal<boolean>(false);
  deleteSort = output();
  sortCriteria = this.filterService.sortCriteria;

  downArrowIcon = ArrowDown;
  upArrowIcon = ArrowUp;
  deleteIcon = Trash2;
  keys = Keys;

  toggleSelectingOption() {
    this.isSelectingOption.set(!this.isSelectingOption());
  }

  onSelectOption(e: Event, target: 'key' | 'order') {
    const selectedValue = (e.target as HTMLSelectElement).value;
    const newKey = target === 'key' ? selectedValue : this.sortCriteria().key!;
    const newOrder =
      target === 'order' ? selectedValue : this.sortCriteria().order;

    this.filterService.addSortCriteria({
      key: newKey,
      order: newOrder as 'asc' | 'desc',
    });
  }

  onDeleteSort() {
    this.deleteSort.emit();
  }
}
