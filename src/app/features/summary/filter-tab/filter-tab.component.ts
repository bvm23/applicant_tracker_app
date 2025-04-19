import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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

  downArrowIcon = ArrowDown;
  upArrowIcon = ArrowUp;
  deleteIcon = Trash2;

  sortCriteria = this.filterService.sortCriteria;

  view = input.required();
  isSelectingOption = signal<boolean>(false);
  deleteSort = output();

  keys = computed(() =>
    this.view() === 'STAGE'
      ? Keys.filter(
          (valKey) =>
            !['stage', 'website', 'employment', 'source'].includes(valKey)
        )
      : Keys
  );

  toggleSelectingOption() {
    this.isSelectingOption.set(!this.isSelectingOption());
  }

  onSelectOption(e: Event, target: 'key' | 'order') {
    const selectedValue = (e.target as HTMLSelectElement).value;
    const newKey =
      target === 'key'
        ? selectedValue === 'hiring manager'
          ? 'hiringManager'
          : selectedValue
        : this.sortCriteria().key!;
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
