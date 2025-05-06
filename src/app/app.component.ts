import { Component } from '@angular/core';
import { HeaderComponent } from './features/header/header.component';
import { icons } from './core/constants/icons.constants';
import { SummaryComponent } from './features/summary/summary.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [HeaderComponent, SummaryComponent, RouterOutlet],
})
export class AppComponent {
  title = 'applicant_tracker';
  readonly searchIcon = icons['SEARCH'];
}
