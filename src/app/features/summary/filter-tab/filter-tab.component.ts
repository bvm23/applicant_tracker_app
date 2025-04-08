import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'at-filter-tab',
  imports: [
    LucideAngularModule,
    ActionButtonComponent,
    PopupMenuComponent,
    FormsModule,
  ],
  templateUrl: './filter-tab.component.html',
  styleUrl: './filter-tab.component.scss',
})
export class FilterTabComponent {
  private filterService = inject(FilterService);
  isSelectingOption = signal<boolean>(false);
  selectedSortCriteria = computed(() => this.filterService.sortCriteria());
  newKey = viewChild<ElementRef<HTMLSelectElement>>('selectedKey');
  newOrder = viewChild<ElementRef<HTMLSelectElement>>('selectedOrder');

  newSortCriteria: { key: string | undefined; order: 'asc' | 'desc' } = {
    key: this.selectedSortCriteria().key,
    order: this.selectedSortCriteria().order,
  };

  downArrowIcon = ArrowDown;
  upArrowIcon = ArrowUp;
  deleteIcon = Trash2;
  keys = Keys;

  toggleSelectingOption() {
    this.isSelectingOption.set(!this.isSelectingOption());
  }

  onSelectOption() {
    this.filterService.addSortCriteria(this.newSortCriteria);
  }
}
