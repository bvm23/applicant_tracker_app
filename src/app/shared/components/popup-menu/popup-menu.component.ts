import { Component, input } from '@angular/core';

@Component({
  selector: 'at-popup-menu',
  imports: [],
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.scss',
})
export class PopupMenuComponent {
  backgroundColor = input<string>();
}
