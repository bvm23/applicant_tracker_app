import { Component, input } from '@angular/core';
import { Data as applicants } from '../../../core/constants/data.constants';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { TableViewComponent } from '../table-view/table-view.component';

@Component({
  selector: 'at-summary-content',
  imports: [GridViewComponent, TableViewComponent],
  templateUrl: './summary-content.component.html',
  styleUrl: './summary-content.component.scss',
})
export class SummaryContentComponent {
  view = input.required<string>();
}
