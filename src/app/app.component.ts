import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { icons } from '../assets/icon/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [HeaderComponent, ActionButtonComponent],
})
export class AppComponent {
  title = 'applicant_tracker';
  readonly searchIcon = icons['SEARCH'];
}
