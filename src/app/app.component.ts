import { Component } from '@angular/core';
import { HeaderComponent } from './features/header/header.component';
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { icons } from './core/constants/icons.constants';
import { SummaryComponent } from './features/summary/summary.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [HeaderComponent, ActionButtonComponent, SummaryComponent],
})
export class AppComponent {
  title = 'applicant_tracker';
  readonly searchIcon = icons['SEARCH'];
}
